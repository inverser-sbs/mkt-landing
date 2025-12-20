/**
 * Helper to get the correct image URL
 * Handles both absolute URLs (http/https) and relative paths (/api/uploads/...)
 */
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const getImageUrl = (url) => {
  if (!url) return null;
  
  // Already an absolute URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Data URL (for previews)
  if (url.startsWith('data:')) {
    return url;
  }
  
  // Relative path - prepend backend URL
  return `${BACKEND_URL}${url}`;
};

export default getImageUrl;
