import { assetsUrl } from "./origin";

/**
 * Reading a cache-tree artifact from server code.
 *
 * ## Why this exists
 *
 * The cache tree has two producers. The i18n repo publishes the translated
 * artifacts to R2 on its own cadence, and the front-end publishes everything
 * else as part of its own deploy. At RUNTIME both are simply objects on R2 and
 * fetching is the only way to read either.
 *
 * At BUILD time that is not true, and assuming it was is a bug that cannot ever
 * succeed. `next build` prerenders pages, those pages read artifacts, and the
 * artifacts the build reads are the ones the generators wrote minutes earlier
 * into `public/static`. They are content-hashed, so any build that changes one
 * asks R2 for a hash that by definition is not there: the upload happens after
 * the build, in the next step of the deploy. The build was requesting an object
 * that could only exist if the build had already succeeded.
 *
 * So during the build these are read from disk. Not as an optimisation, and not
 * as a fallback: it is the only correct source, because the file on disk IS the
 * object that is about to be uploaded.
 *
 * ## Why the rule is "during the build", not "artifacts we own"
 *
 * The tempting narrower rule is to read front-end-owned artifacts locally and
 * fetch the i18n-owned ones. It is wrong twice over. The build prerenders
 * translated pages too, and their artifacts are on disk as well, because the
 * front-end generators write every locale they have content for. And it would
 * leave the same landmine in every artifact the front-end adds later, since
 * ownership is not something a call site can see.
 *
 * The honest rule is about WHEN, not WHO: while the build is running there is a
 * filesystem and the artifacts are on it; once it is deployed there is neither.
 *
 * ## Runtime is unaffected
 *
 * `deploy` runs build, then `static:upload`, then `wrangler deploy`. Objects are
 * uploaded before the worker that needs them goes live, and hashed artifacts are
 * immutable and never deleted, so the outgoing worker keeps resolving the hashes
 * it was built with. A cold deploy has no window where a request can arrive for
 * an artifact that is not there yet.
 */

/**
 * Whether this is the production build rather than a running server.
 *
 * `NEXT_PHASE` is set by Next for the duration of `next build` and by nothing
 * else, which is exactly the distinction that matters: a filesystem holding the
 * artifacts exists in one case and not the other.
 */
function isBuild(): boolean {
  return process.env.NEXT_PHASE === "phase-production-build";
}

/** What a caller needs from an artifact read, whether it came from disk or R2. */
export interface ArtifactResult {
  ok: boolean;
  status: number;
  text: () => Promise<string>;
  json: <T>() => Promise<T>;
}

/**
 * Read one cache-tree artifact by its `/static/...` path.
 *
 * A miss is reported, never thrown and never papered over: callers decide
 * whether a missing artifact is fatal (a concept page's HTML) or an empty state
 * (a locale with no blog posts), and that decision stays where it belongs.
 */
export async function readArtifact(path: string): Promise<ArtifactResult> {
  if (isBuild()) {
    // Dynamically imported so the module graph a Worker bundles never pulls in
    // node:fs for a branch that only ever runs on a build machine.
    const [fs, nodePath] = await Promise.all([import("node:fs/promises"), import("node:path")]);
    const file = nodePath.join(process.cwd(), "public", path);

    try {
      const body = await fs.readFile(file, "utf8");
      return {
        ok: true,
        status: 200,
        text: () => Promise.resolve(body),
        json: () => Promise.resolve(JSON.parse(body))
      };
    } catch {
      const missing = () => Promise.reject(new Error(`No artifact on disk at ${file}`));
      return { ok: false, status: 404, text: missing, json: missing };
    }
  }

  const res = await fetch(await assetsUrl(path));
  return {
    ok: res.ok,
    status: res.status,
    text: () => res.text(),
    json: <T>() => res.json() as Promise<T>
  };
}

/** One artifact as JSON, or null when it is not there. */
export async function readArtifactJson<T>(path: string): Promise<T | null> {
  try {
    const res = await readArtifact(path);
    return res.ok ? await res.json<T>() : null;
  } catch {
    return null;
  }
}
