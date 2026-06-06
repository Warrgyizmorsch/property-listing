export default function LoadingState({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(count)].map((_, idx) => (
        <div 
          key={idx} 
          className="flex flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white p-5 shadow-xs animate-pulse dark:border-zinc-800 dark:bg-zinc-900/40"
        >
          {/* Image Skeleton */}
          <div className="aspect-video w-full rounded-xl bg-neutral-200 dark:bg-zinc-800" />
          
          {/* Details Skeleton */}
          <div className="mt-4 flex justify-between items-center">
            <div className="h-4 w-1/4 rounded bg-neutral-200 dark:bg-zinc-800" />
            <div className="h-4 w-1/3 rounded bg-neutral-200 dark:bg-zinc-800" />
          </div>
          
          <div className="mt-4 h-6 w-3/4 rounded bg-neutral-200 dark:bg-zinc-800" />
          <div className="mt-2 h-4 w-1/2 rounded bg-neutral-200 dark:bg-zinc-800" />
          
          {/* Features Divider */}
          <div className="mt-6 border-t border-neutral-100 pt-4 dark:border-neutral-800">
            <div className="grid grid-cols-3 gap-2">
              <div className="h-8 rounded bg-neutral-200 dark:bg-zinc-800" />
              <div className="h-8 rounded bg-neutral-200 dark:bg-zinc-800" />
              <div className="h-8 rounded bg-neutral-200 dark:bg-zinc-800" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
