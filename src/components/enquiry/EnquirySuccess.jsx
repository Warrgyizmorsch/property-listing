import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EnquirySuccess({ onReset }) {
  return (
    <div className="flex flex-col items-center text-center py-6 px-4 animate-fade-in">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 shadow-xs">
        <CheckCircle2 className="h-7 w-7" />
      </div>
      
      <h3 className="mt-5 text-base font-bold text-neutral-900 dark:text-white">
        Enquiry Sent Successfully!
      </h3>
      
      <p className="mt-2 text-xs font-semibold text-neutral-500 dark:text-neutral-450 leading-5 max-w-[240px]">
        Thank you for your interest. Our senior real estate advisor has received your details and will get in touch shortly.
      </p>

      {/* Button to reset state if needed */}
      {onReset && (
        <Button
          onClick={onReset}
          variant="ghost"
          size="sm"
          className="mt-6 text-xs text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)] hover:bg-neutral-50 dark:text-[var(--brand-secondary)] dark:hover:bg-zinc-850"
        >
          Submit Another Enquiry
        </Button>
      )}
    </div>
  );
}
