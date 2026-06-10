"use client"

import React, { useState, useRef } from "react"
import { UploadCloud, FileImage, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { getUploadSignatureAction, saveUploadedImageAction } from "../actions/image.actions"
import { toast } from "@/components/ui/toast"
import { useRouter } from "next/navigation"

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export default function ProjectImageUploader({ projectId, currentCount = 0, isEdit = true, onUploadSuccess }) {
  const router = useRouter()
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [queue, setQueue] = useState([]) // Array of { id, file, name, progress, status: 'pending'|'uploading'|'success'|'error', errorMsg }

  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const handleFiles = (files) => {
    const totalNew = files.length
    if (currentCount + totalNew > 10) {
      toast.error(`Cannot upload. Adding ${totalNew} images would exceed the maximum limit of 10 images total.`)
      return
    }

    const validFiles = []
    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`"${file.name}" rejected. Format must be JPG, JPEG, PNG or WEBP.`)
        continue
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`"${file.name}" rejected. File exceeds the 5MB size limit.`)
        continue
      }
      validFiles.push({
        id: Math.random().toString(36).substring(2, 9),
        file,
        name: file.name,
        progress: 0,
        status: "pending",
        errorMsg: "",
      })
    }

    if (validFiles.length === 0) return

    setQueue((prev) => [...prev, ...validFiles])
    startUploads(validFiles)
  }

  const updateQueueItem = (id, updates) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    )
  }

  const startUploads = async (filesToUpload) => {
    setUploading(true)

    for (const item of filesToUpload) {
      updateQueueItem(item.id, { status: "uploading", progress: 5 })

      try {
        // Step A: Request signature credentials from Server Action
        const sigResult = await getUploadSignatureAction(isEdit ? projectId : "temp")
        if (!sigResult.success) {
          throw new Error(sigResult.error || "Failed to generate signature credentials.")
        }

        const { credentials, folder } = sigResult

        // Step B: Upload file directly to Cloudinary via XHR to support progress tracking
        const uploadResponse = await uploadToCloudinaryXHR(item, credentials, folder)

        if (isEdit) {
          // Step C: Save image metadata to database
          const saveResult = await saveUploadedImageAction(projectId, {
            url: uploadResponse.secure_url,
            publicId: uploadResponse.public_id,
          })

          if (!saveResult.success) {
            throw new Error(saveResult.error || "Failed to save metadata to database.")
          }
        } else {
          // Client-side/creation phase callback
          if (onUploadSuccess) {
            onUploadSuccess({
              url: uploadResponse.secure_url,
              publicId: uploadResponse.public_id,
            })
          }
        }

        updateQueueItem(item.id, { status: "success", progress: 100 })
      } catch (err) {
        console.error("Upload failure for: ", item.name, err)
        updateQueueItem(item.id, { status: "error", progress: 0, errorMsg: err.message || "Upload failed" })
        toast.error(`Failed to upload "${item.name}": ${err.message}`)
      }
    }

    setUploading(false)
    if (isEdit) {
      router.refresh()
    }

    // Clear success queue items after 3 seconds
    setTimeout(() => {
      setQueue((prev) => prev.filter((item) => item.status === "error"))
    }, 3000)
  }

  // Upload file to Cloudinary with native XHR progress tracking
  const uploadToCloudinaryXHR = (queueItem, credentials, folder) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      const formData = new FormData()

      formData.append("file", queueItem.file)
      formData.append("api_key", credentials.apiKey)
      formData.append("timestamp", credentials.timestamp)
      formData.append("signature", credentials.signature)
      formData.append("folder", folder)

      xhr.open("POST", `https://api.cloudinary.com/v1_1/${credentials.cloudName}/image/upload`)

      // Track live upload progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100)
          // Scale progress to 90% during upload, leaving 10% for the DB write
          updateQueueItem(queueItem.id, { progress: Math.min(Math.round(percentComplete * 0.9), 90) })
        }
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText)
            resolve(response)
          } catch (e) {
            reject(new Error("Invalid server response format."))
          }
        } else {
          reject(new Error(`Cloudinary server error: ${xhr.statusText}`))
        }
      }

      xhr.onerror = () => reject(new Error("Network connection error."))
      xhr.send(formData)
    })
  }

  return (
    <div className="space-y-4">
      {/* Upload Drag & Drop Box */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer ${dragActive
            ? "border-neutral-900 bg-neutral-50/50"
            : "border-neutral-200 bg-white hover:bg-neutral-50/20 hover:border-neutral-300"
          } ${currentCount >= 10 ? "opacity-50 pointer-events-none" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp"
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading || currentCount >= 10}
        />

        <UploadCloud className={`h-10 w-10 text-neutral-400 mb-3 ${dragActive ? "text-neutral-900 scale-110" : ""} transition-transform`} />

        {currentCount >= 10 ? (
          <div>
            <h4 className="text-sm font-semibold text-neutral-900">Maximum limit reached</h4>
            <p className="text-xs text-neutral-500 mt-1 mt-1.5">
              Delete existing images before uploading new ones. (Max 10 images per project)
            </p>
          </div>
        ) : (
          <div>
            <h4 className="text-sm font-semibold text-neutral-900">
              Drag & Drop images or <span className="text-neutral-950 font-bold underline">Browse files</span>
            </h4>
            <p className="text-xs text-neutral-400 mt-1.5">
              Supports JPEG, JPG, PNG, WEBP (Max 5MB per file, up to 10 total)
            </p>
          </div>
        )}
      </div>

      {/* Uploading Queue Status */}
      {queue.length > 0 && (
        <div className="bg-white border border-neutral-200 rounded-lg p-4 space-y-3 shadow-xs max-h-48 overflow-y-auto">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Upload Status Queue</h4>
          <div className="space-y-2.5">
            {queue.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-xs gap-3">
                <div className="flex items-center gap-2 max-w-[60%]">
                  <FileImage className="h-4 w-4 text-neutral-400 shrink-0" />
                  <span className="truncate font-medium text-neutral-700">{item.name}</span>
                </div>

                <div className="flex items-center gap-3 flex-1 justify-end">
                  {/* Progress bar */}
                  {item.status === "uploading" && (
                    <div className="w-24 bg-neutral-100 h-1.5 rounded-full overflow-hidden shrink-0">
                      <div
                        className="bg-neutral-900 h-full transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  )}

                  {/* Status labels */}
                  {item.status === "uploading" && (
                    <span className="text-neutral-500 font-semibold flex items-center gap-1 select-none">
                      <Loader2 className="h-3 w-3 animate-spin text-neutral-800" />
                      <span>{item.progress}%</span>
                    </span>
                  )}

                  {item.status === "success" && (
                    <span className="text-green-600 font-semibold flex items-center gap-1">
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>Uploaded</span>
                    </span>
                  )}

                  {item.status === "error" && (
                    <span className="text-red-600 font-semibold flex items-center gap-1" title={item.errorMsg}>
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span>Error</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
