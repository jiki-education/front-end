const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Validate an uploaded image file. Returns a `toasts` translation key describing
 * the problem (for a keyed error toast), or null when the file is acceptable.
 */
export function validateImageFile(file: File): "avatar.invalidImageType" | "avatar.imageTooLarge" | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return "avatar.invalidImageType";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "avatar.imageTooLarge";
  }
  return null;
}
