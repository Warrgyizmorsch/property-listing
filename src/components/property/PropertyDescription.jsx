export default function PropertyDescription({ description }) {
  if (!description) return null;

  return (
    <div className="py-8 border-b border-neutral-100 dark:border-neutral-850">
      <h2 className="font-heading text-lg font-bold text-neutral-900 uppercase tracking-widest mb-5 dark:text-white">
        Description
      </h2>
      <div className="prose max-w-none text-neutral-600 dark:prose-invert dark:text-neutral-300">
        <p className="whitespace-pre-line text-sm leading-7">
          {description}
        </p>
      </div>
    </div>
  );
}
