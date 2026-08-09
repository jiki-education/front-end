# @jiki.io/content-renderer

The one implementation of "Jiki curriculum prose to the exact bytes Jiki serves".

## Why it exists

Jiki's English prose is authored in the front-end monorepo. Its translations live in the separate
[`i18n`](https://github.com/jiki-education/i18n) repo. Both publish to the same content-hashed R2
tree, where an artifact's filename **is** the hash of its bytes:

```
/static/concepts/{slug}/{locale}/content-{hash}.html
```

So the two repos do not need to render similar HTML, they need to render **byte-identical** HTML
for identical input. A one-character difference moves the hash, and the front-end then computes a
URL that nothing was ever written to. A second implementation in `i18n` would be two renderers
drifting apart, and the drift would surface as a wrong-looking page rather than as an error.

**The package version is the contract.** Both repos pin an exact version, and a rendering change is
a version bump both sides take deliberately.

## API

| Export                    | What it is                                                                 |
| ------------------------- | -------------------------------------------------------------------------- |
| `renderMarkdown(md)`      | Concept-page Markdown to the exact HTML Jiki serves                        |
| `prepareInstructions(md)` | Exercise instructions prepared for caching: trim plus the inline-tag strip |
| `stripInlineTags(text)`   | Removes `<define>`/`<literal>`, keeping the inner text                     |
| `contentHash(content)`    | The cache tree's fingerprint: first 12 hex chars of SHA-256                |
| `RENDERER_VERSION`        | This package's version, for recording in artifact metadata                 |
| `registeredLanguages()`   | The highlight.js grammars registered here                                  |
| `isSupportedLanguage(l)`  | Whether a fenced block's language has a grammar here                       |

Input to `renderMarkdown` is the Markdown **body**, frontmatter already removed. Frontmatter
parsing is not this package's job: the two repos parse it differently on purpose, and it never
reaches the rendered bytes.

## The two prose pipelines

Jiki's two prose types are cached differently, and both are byte-sensitive:

- **Concept pages** are rendered to HTML at build time and served as `content-{hash}.html`.
  `renderMarkdown` is that pipeline.
- **Exercise instructions** are cached as Markdown inside a JSON content file and rendered in the
  browser at runtime, so the build-time step is only the inline-tag strip and the trim.
  `prepareInstructions` is that pipeline.

They share `stripInlineTags`, which is the whole reason they can disagree.

## What is part of the contract

Anything that can move a byte:

- the `marked` version and its configuration
- the set of highlight.js grammars registered, and their versions
- the `<define>`/`<literal>` strip

Grammar and `marked` versions are therefore **pinned exactly**, not ranged. Only Jiki's own two
grammars are registered (`jikiscript`, and a Jiki-specific `javascript`), on a private
`hljs.newInstance()`. A fence in any other language is escaped as plain text rather than
highlighted, deliberately: picking up whatever grammars the host process happened to register would
make the bytes depend on the caller.

For the same reason `marked` is used through a private `new Marked()` instance and never the
module-level singleton, whose `.use()` mutates global state shared with the front-end's blog
pipeline.

## The `@jiki/highlightjs-javascript` dependency

That grammar is not on npm, and a published package cannot depend on an unpublished one. It does
not have to be published, because it is depended on as a **git URL pinned to a commit SHA**:

```
git+https://github.com/jiki-education/highlightjs-javascript.git#1801576...
```

npm and pnpm both resolve a git dependency of a published package for external consumers. The repo
is public, its `dist/` is committed so no build step runs on install, and resolution falls back to
HTTPS when no SSH key is present, which is verified by installing the packed tarball into a clean
project with a cold cache and SSH disabled.

The SHA pin is not optional. A branch pin would let the grammar move under a released version of
this package, which would silently break the byte-identity contract in exactly the way the version
pin exists to prevent. Bumping the grammar means bumping the SHA and this package's version
together.

Publishing it to npm as `@jiki.io/highlightjs-javascript` would be tidier and would restore
integrity checking on install. It is not required, so it is not done here.

## Releasing

Publishing is manual, via the **Publish Content Renderer** workflow, using npm trusted publishing
(OIDC). No token is stored. npm's trusted publisher record pins this repository and the publish
workflow's **filename**, so that file must not be renamed or moved.
