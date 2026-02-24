const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function validateImageFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return "Please select a JPEG, PNG, GIF, or WebP image";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "Image must be less than 5MB";
  }
  return null;
}
