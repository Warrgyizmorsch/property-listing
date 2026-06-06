export default function PropertyStatusBadge({ status }) {
  if (!status) return null;
  return (
    <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold border shadow-xs ${status.colorClass || "bg-white text-neutral-800 border-neutral-200"}`}>
      {status.name}
    </span>
  );
}
