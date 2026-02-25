const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800";

/**
 * Extracts a valid image URL from a string.
 * Handles cases where users paste imgbb/embed HTML instead of plain URLs.
 */
export function getImageUrl(input: string | null | undefined): string {
  if (!input || typeof input !== "string") return FALLBACK_IMAGE;
  const trimmed = input.trim();
  if (!trimmed) return FALLBACK_IMAGE;

  // Already a valid URL
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/")) {
    return trimmed;
  }

  // Extract src from <img src="...">
  const imgMatch = trimmed.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch) return imgMatch[1];

  // Fallback: try to find any URL in the string
  const urlMatch = trimmed.match(/https?:\/\/[^\s"'>]+/i);
  if (urlMatch) return urlMatch[0];

  return FALLBACK_IMAGE;
}

/** Process an array of image strings (e.g. product.images) */
export function getImageUrls(inputs: (string | null | undefined)[] | string): string[] {
  if (typeof inputs === "string") {
    try {
      const parsed = JSON.parse(inputs) as string[];
      return Array.isArray(parsed) ? parsed.map(getImageUrl) : [getImageUrl(inputs)];
    } catch {
      return [getImageUrl(inputs)];
    }
  }
  if (!Array.isArray(inputs)) return [FALLBACK_IMAGE];
  return inputs.map(getImageUrl);
}
