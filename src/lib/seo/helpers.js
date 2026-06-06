/**
 * Strips HTML tags from a string and normalizes spacing.
 */
export function stripHtml(text) {
  if (!text) return "";
  return text
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Cleanly truncates text to a maximum length.
 */
export function truncateText(text, maxLength = 160) {
  if (!text) return "";
  const cleaned = stripHtml(text);
  if (cleaned.length <= maxLength) return cleaned;
  return cleaned.slice(0, maxLength - 3).trim() + "...";
}

/**
 * Resolves absolute URLs from relative paths.
 */
export function getAbsoluteUrl(path = "") {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const sanitizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${sanitizedPath === "/" ? "" : sanitizedPath}`;
}
