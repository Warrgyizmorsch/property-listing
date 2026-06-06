import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce rapid value changes (e.g. search box typing).
 * @param {any} value 
 * @param {number} delay 
 * @returns {any}
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
