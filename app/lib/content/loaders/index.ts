import type { ContentLoader } from "./types";

export type { ContentLoader, SearchIndexData } from "./types";

let cachedLoader: ContentLoader | null = null;

export async function getContentLoader(): Promise<ContentLoader> {
  if (cachedLoader) {
    return cachedLoader;
  }

  if (process.env.NODE_ENV === "development") {
    const { FilesystemContentLoader } = await import("./filesystem-loader");
    cachedLoader = new FilesystemContentLoader();
  } else {
    const { R2ContentLoader } = await import("./r2-loader");
    cachedLoader = new R2ContentLoader();
  }

  return cachedLoader;
}
