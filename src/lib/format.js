/**
 * Formats a numeric value into a currency string.
 * @param {number|string|Decimal} amount 
 * @param {string} currencyCode 
 * @param {string} locale 
 * @returns {string}
 */
export function formatCurrency(amount, currencyCode = 'USD', locale = 'en-US') {
  const numericAmount = typeof amount === 'object' ? Number(amount) : parseFloat(amount);
  if (isNaN(numericAmount)) return '$0';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(numericAmount);
}

/**
 * Formats an area value with standard units.
 * @param {number} size 
 * @param {string} unit 
 * @returns {string}
 */
export function formatArea(size, unit = 'sq ft') {
  const numericSize = parseInt(size, 10);
  if (isNaN(numericSize)) return `0 ${unit}`;
  return `${new Intl.NumberFormat('en-US').format(numericSize)} ${unit}`;
}

/**
 * Formats a Date object or ISO string into a readable format.
 * @param {Date|string} date 
 * @returns {string}
 */
export function formatDate(date) {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(dateObj);
}
