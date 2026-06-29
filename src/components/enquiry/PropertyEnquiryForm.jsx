"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { createPublicEnquiryAction } from "@/features/enquiries/public/actions/enquiry.public.actions";
import EnquirySuccess from "./EnquirySuccess";

export default function PropertyEnquiryForm({
  propertyId,
  propertyTitle,
  projectId,
  projectTitle,
  onSuccess = null,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const defaultRef = propertyId
    ? String(propertyId).slice(0, 8)
    : projectId
      ? String(projectId).slice(0, 8)
      : null;
  const [message, setMessage] = useState(
    propertyTitle
      ? `I am interested in "${propertyTitle}" (Ref: ${defaultRef}) and would like to arrange a private viewing. Please contact me.`
      : projectTitle
        ? `I am interested in project "${projectTitle}" (Ref: ${defaultRef}) and would like to receive pricing details. Please contact me.`
        : `I am interested and would like to learn more. Please contact me.`,
  );
  const [website, setWebsite] = useState(""); // Honeypot field for spam prevention
  const [isPending, setIsPending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !phone.trim() || !message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsPending(true);

    try {
      const result = await createPublicEnquiryAction({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: message.trim(),
        propertyId,
        projectId,
        website: website.trim(), // Send honeypot value
      });

      if (result?.error) {
        toast.error(result.error);
      } else if (result?.success) {
        setSuccess(true);
        toast.success("Enquiry submitted successfully!");
        // Reset fields
        setName("");
        setEmail("");
        setPhone("");
        if (typeof onSuccess === "function") onSuccess();
      }
    } catch (err) {
      console.error("Failed to submit public enquiry:", err);
      const msg = err?.message || (err && String(err)) || null;
      toast.error(
        msg ||
        "Something went wrong. Please check your connection and try again.",
      );
    } finally {
      setIsPending(false);
    }
  };

  if (success) {
    return <EnquirySuccess onReset={() => setSuccess(false)} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Honeypot field (hidden from users, autocomplete off, tabIndex -1) */}
      <div className="absolute opacity-0 pointer-events-none -z-10 h-0 w-0 overflow-hidden">
        <label htmlFor="confirm_website_hp">Do Not Fill</label>
        <input
          id="confirm_website_hp"
          type="text"
          name="confirm_website_hp"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          autoComplete="new-password"
          tabIndex={-1}
        />
      </div>

      {/* Name Input */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
          Your Name <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          required
          disabled={isPending}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="First and last name"
          className="focus-visible:ring-[var(--primary)]"
        />
      </div>

      {/* Email Input */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
          Email Address <span className="text-red-500">*</span>
        </label>
        <Input
          type="email"
          required
          disabled={isPending}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          className="focus-visible:ring-[var(--primary)]"
        />
      </div>

      {/* Phone Input */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <Input
          type="tel"
          required
          disabled={isPending}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+1 (555) 000-0000"
          className="focus-visible:ring-[var(--primary)]"
        />
      </div>

      {/* Message Input */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
          Message <span className="text-red-500">*</span>
        </label>
        <Textarea
          required
          rows={4}
          disabled={isPending}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="focus-visible:ring-[var(--primary)]"
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full primary-btn h-10"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin shrink-0" />
            Sending Enquiry...
          </>
        ) : (
          "Send Enquiry"
        )}
      </Button>
    </form>
  );
}
