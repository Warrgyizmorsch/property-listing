import { MessageSquare } from "lucide-react";

export default function WhatsAppButton({ phone, propertyTitle }) {
  if (!phone) return null;

  // Sanitize number: keep only digits
  const cleanNumber = phone.replace(/[^0-9]/g, "");

  // Custom encoded text linking the property context
  const textMessage = `Hi, I am interested in the listing "${propertyTitle}". Please contact me with more information.`;
  const encodedText = encodeURIComponent(textMessage);

  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedText}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2.5 p-3 w-full rounded-xl border border-[var(--brand-border)] bg-[var(--brand-primary-soft)] hover:bg-[var(--brand-secondary-soft)] text-[var(--brand-primary)] text-xs font-bold transition-all dark:border-[var(--brand-border)] dark:text-[var(--brand-secondary)] dark:hover:bg-[var(--brand-secondary-soft)]"
    >
      <MessageSquare className="h-4.5 w-4.5 text-[var(--brand-secondary)] shrink-0" />
      <span>Chat via WhatsApp</span>
    </a>
  );
}
