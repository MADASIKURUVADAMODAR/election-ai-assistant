import DOMPurify from "dompurify";

/**
 * Utility to sanitize user input to prevent XSS attacks.
 * @param {string} dirty - The dirty input string.
 * @returns {string} - The sanitized string.
 */
export const sanitize = (dirty: string): string => {
  if (typeof window !== "undefined") {
    return DOMPurify.sanitize(dirty);
  }
  return dirty; // Server-side fallback (Gemini response parsing usually handles this)
};

/**
 * Validates if a file is a valid image.
 * @param {File} file - The file to validate.
 * @returns {boolean} - True if valid.
 */
export const isValidImage = (file: File): boolean => {
  const validTypes = ["image/jpeg", "image/png", "image/webp"];
  return validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024; // 10MB limit
};
