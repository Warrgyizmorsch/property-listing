import { Phone } from "lucide-react";

export default function CallButton({ phone }) {
  if (!phone) return null;

  return (
    <a
      href={`tel:${phone}`}
      className="flex items-center justify-center gap-2.5 p-3 w-full rounded-xl border border-neutral-100 bg-neutral-50/20 hover:bg-neutral-50 text-neutral-700 text-xs font-bold transition-all dark:border-zinc-850 dark:text-zinc-300 dark:hover:bg-zinc-850"
    >
      <Phone className="h-4.5 w-4.5 text-indigo-500 shrink-0" />
      <span>Call: {phone}</span>
    </a>
  );
}
