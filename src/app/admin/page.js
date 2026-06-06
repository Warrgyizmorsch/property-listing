import { redirect } from "next/navigation";

/**
 * Root Admin route landing handler.
 * Automatically forwards users to the Dashboard screen.
 */
export default function AdminRootPage() {
  redirect("/admin/dashboard");
}
