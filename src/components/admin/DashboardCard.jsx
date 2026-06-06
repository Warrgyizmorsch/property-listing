import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Reusable statistics card for dashboard overview grid.
 * @param {object} props
 * @param {string} props.title - Metric title.
 * @param {string|number} props.value - Display value.
 * @param {React.ReactNode} [props.icon] - Metric visual icon.
 * @param {string} [props.description] - Helpful sub-text description.
 * @param {string} [props.className] - CSS class extension.
 */
export default function DashboardCard({
  title,
  value,
  icon,
  description,
  className = "",
}) {
  return (
    <Card className={`border-neutral-200 bg-white shadow-sm transition-all hover:shadow-md ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          {title}
        </CardTitle>
        {icon && (
          <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-neutral-50 text-neutral-600 border border-neutral-100">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-neutral-900 tracking-tight">{value}</div>
        {description && (
          <p className="text-xs text-neutral-400 mt-2.5 font-medium">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
