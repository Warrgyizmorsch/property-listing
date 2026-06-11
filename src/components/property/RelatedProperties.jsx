import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { getRelatedProperties } from "@/features/property-details/services/detail.service";
import { UnitPropertyCard } from "../projects/ProjectConfigurationsTabs";

export default async function RelatedProperties({ property }) {
  // Query related listings on the server
  const related = await getRelatedProperties({
    propertyId: property.id,
    categoryId: property.categoryId,
    cityId: property.cityId,
    limit: 4,
  });

  if (related.length === 0) return null; // Hide the section if no related properties are found

  return (
    <div className="pb-4 pt-12 border-t border-neutral-100 dark:border-neutral-850">
      <h2 className="section-heading">
        Similar Listings You May Like
      </h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {related.map((item) => (
          <UnitPropertyCard
            key={item.id}
            property={item}
          />
        ))}
      </div>
    </div>
  );
}
