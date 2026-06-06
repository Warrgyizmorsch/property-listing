import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

// Configure Cloudinary SDK credentials
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

/**
 * Generates signed upload parameters for direct client-side uploads.
 * @param {string} folder - Target folder on Cloudinary
 * @returns {{ signature: string, timestamp: number, apiKey: string, cloudName: string }}
 */
export function generateUploadSignature(folder) {
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Missing Cloudinary environment configuration keys.");
  }

  const timestamp = Math.round(new Date().getTime() / 1000);
  
  // Parameters that will be verified on Cloudinary's side
  const paramsToSign = {
    timestamp,
    folder,
  };

  const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

  return {
    signature,
    timestamp,
    apiKey,
    cloudName,
  };
}

/**
 * Deletes an image from Cloudinary by its public ID.
 * @param {string} publicId - The public ID of the Cloudinary resource
 * @returns {Promise<{result: string}>}
 */
export async function deleteFromCloudinary(publicId) {
  if (!publicId) return null;
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        console.error("Cloudinary destroy error:", error);
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}
