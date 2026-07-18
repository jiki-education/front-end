import { assetHashes } from "@/lib/generated/asset-hashes";
import { assetsUrl } from "@/lib/assets";

/**
 * Resolve a hand-authored asset path (image, sound, icon) to the URL it should be
 * loaded from: its content-hashed copy on R2 in production, the relative path in
 * development.
 *
 * Pass the path relative to `/static` (no `/static/` prefix); the fingerprint is
 * looked up in the generated manifest (scripts/generate-asset-cache.js). Works in
 * both client and Server Components (synchronous — no request headers needed). A
 * path with no manifest entry falls through to assetsUrl(`/static/${path}`)
 * unchanged, so un-fingerprinted paths still resolve.
 *
 * Examples:
 *   staticAsset("images/logo.png")
 *   staticAsset(`images/projects/covers/${project.image}`)
 *   staticAsset(`icons/lessons/${slug}.svg`)
 */
export function staticAsset(path: string): string {
  return assetsUrl(assetHashes[path] ?? `/static/${path}`);
}

/** Whether a fingerprinted copy exists for this asset path (e.g. to pick a fallback). */
export function hasStaticAsset(path: string): boolean {
  return path in assetHashes;
}
