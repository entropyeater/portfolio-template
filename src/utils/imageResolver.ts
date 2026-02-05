/**
 * Map of image paths to imported asset URLs.
 * This allows us to use path strings from JSON/CSV while still getting
 * Vite to process the assets correctly (with hashing, optimization, etc.)
 */
const imageMap: Record<string, string> = {};

/**
 * Resolves image paths from JSON/CSV to actual asset URLs.
 * 
 * Supported path formats:
 * 1. Full URLs (http/https) - Returns as-is
 *    Example: "https://example.com/images/photo.png"
 * 
 * 2. Public directory paths (starting with /) - Returns as-is
 *    Example: "/images/photo.png" (file should be in public/images/photo.png)
 *    These are served from the root and not processed by Vite
 * 
 * 3. Mapped build assets - Returns imported asset URL (processed by Vite)
 *    Examples: "/assets/image.png", "figma:asset/image.png"
 *    These are in src/assets/ and processed during build
 * 
 * @param path - Image path from JSON/CSV
 * @returns Resolved URL that can be used in img src
 */
export function resolveImagePath(path: string): string {
  // If it's already a full URL, return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Check if we have a mapped version (build assets)
  if (imageMap[path]) {
    return imageMap[path];
  }
  
  // If it starts with /, treat it as a public asset path
  // These are served from the root and not processed by Vite
  // Files should be in the public/ directory (or served from root in production)
  if (path.startsWith('/')) {
    return path;
  }
  
  // For any other paths, return as-is (might be relative paths or other formats)
  // Only warn if it looks like it might be a mistake
  if (path.includes('asset') || path.includes('figma:')) {
    console.warn(`⚠️  Image path not found in resolver (might need to be added to imageMap): ${path}`);
  }
  
  return path;
}
