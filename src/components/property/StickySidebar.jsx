import Image from "next/image";
import PropertyEnquiryForm from "@/components/enquiry/PropertyEnquiryForm";
import CallButton from "@/components/enquiry/CallButton";
import WhatsAppButton from "@/components/enquiry/WhatsAppButton";

export default function StickySidebar({ property }) {
  const contactNumber = property.contactNumber || "+1 (212) 555-0199";

  return (
    <div className="sticky top-24 flex flex-col gap-6 w-full lg:max-w-sm">
      
      {/* Dynamic Validated Enquiry Form Container */}
      <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/40">
        <h3 className="font-heading text-base font-extrabold text-neutral-900 uppercase tracking-widest mb-4 dark:text-white">
          Enquire About Property
        </h3>
        
        <PropertyEnquiryForm propertyId={property.id} propertyTitle={property.title} />
      </div>

      {/* Direct Advisor Contacts Card */}
      {/* <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative h-12 w-12 rounded-full overflow-hidden bg-neutral-100 border border-neutral-100 shrink-0">
            <Image
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120&h=120"
              alt="Sarah Sterling"
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-neutral-900 dark:text-white">Sarah Sterling</h4>
            <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Senior Real Estate Advisor</p>
          </div>
        </div>

        <div className="space-y-2.5">
          <CallButton phone={contactNumber} />

          <WhatsAppButton phone={contactNumber} propertyTitle={property.title} />
        </div>
      </div> */}

    </div>
  );
}
