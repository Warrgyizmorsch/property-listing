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
      className="flex items-center justify-center gap-2.5 p-3 w-full rounded-xl border border-emerald-100 bg-emerald-50/20 hover:bg-emerald-50 text-emerald-700 text-xs font-extrabold transition-all dark:border-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-950/20"
    >
      <MessageSquare className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
      <span>Chat via WhatsApp</span>
    </a>
  );
}
