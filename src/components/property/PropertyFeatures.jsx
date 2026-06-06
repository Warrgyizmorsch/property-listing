import { Check } from "lucide-react";

export default function PropertyFeatures({ category }) {
  const categorySlug = category?.slug?.toLowerCase() || "";

  // Dynamic contextual list of premium features based on property category
  const getAmenities = () => {
    switch (categorySlug) {
      case "villa":
        return [
          "Private Swimming Pool",
          "Landscaped Private Garden",
          "Spacious Double Garage",
          "Smart Home Security System",
          "Walk-in Wine Cellar",
          "Outdoor Entertaining Deck",
        ];
      case "apartment":
        return [
          "24/7 Concierge & Security",
          "High-speed Elevator Access",
          "Exclusive Residents Gym",
          "Secured Underground Parking",
          "Private Panoramic Balcony",
          "Integrated Central Air/AC",
        ];
      case "commercial":
        return [
          "Dedicated Conference Suites",
          "Fiber Optic Gigabit Internet",
          "Multi-zone Central HVAC",
          "Secured Building Card Access",
          "Underground Public Parking",
          "Dedicated Loading Dock Entry",
        ];
      case "penthouse":
        return [
          "Private Rooftop Terrace",
          "Private Elevator Lobby",
          "Floor-to-ceiling Panoramic Glass",
          "Outdoor Jacuzzi / Spa",
          "Professional Chef Kitchen",
          "High-fidelity Integrated Audio",
        ];
      default:
        return [
          "Paved Road Access Ready",
          "Municipal Water Connection",
          "Three-phase Power Supply",
          "Boundary Perimeter Fencing",
          "Zoning Permits Approved",
          "Fully Level Terrain Grading",
        ];
    }
  };

  const amenities = getAmenities();

  return (
    <div className="py-8 border-b border-neutral-100 dark:border-neutral-850">
      <h2 className="font-heading text-lg font-bold text-neutral-900 uppercase tracking-widest mb-5 dark:text-white">
        Features & Amenities
      </h2>
      
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {amenities.map((amenity, idx) => (
          <div key={idx} className="flex items-center gap-2.5 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <Check className="h-3.5 w-3.5" />
            </div>
            <span>{amenity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
