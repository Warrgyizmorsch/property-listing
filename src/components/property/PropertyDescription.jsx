export default function PropertyDescription({ description }) {
  if (!description) return null;

  return (
    <div className="border-b border-neutral-100 dark:border-neutral-850">
      <h2 className="section-heading">
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
