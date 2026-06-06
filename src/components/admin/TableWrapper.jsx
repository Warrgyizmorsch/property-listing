import React from "react";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Reusable wrapper for admin tables to maintain layout consistency.
 * @param {object} props
 * @param {string} [props.title] - Optional table container title.
 * @param {React.ReactNode} props.children - Table element.
 * @param {React.ReactNode} [props.pagination] - Optional pagination slot.
 */
export default function TableWrapper({ children, pagination }) {
  return (
    <Card className="border-neutral-200 shadow-sm overflow-hidden bg-white">
      <CardContent className="p-0">
        <div className="w-full overflow-x-auto">
          {children}
        </div>
        {pagination && (
          <div className="flex items-center justify-between border-t border-neutral-100 px-6 py-4 bg-neutral-50/50">
            {pagination}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
