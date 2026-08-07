# API TODO — video data moves to the front end

The front end now owns every video the platform plays. Videos are authored in
`curriculum/src/videos/videos.json` (keyed by video slug, one entry per locale
plus a required `fallback`), referenced from `curriculum/src/concepts/{slug}/config.json`
(`"video": "<video-slug>"`) and from exercise `metadata.json` (`"walkthroughVideo": "<video-slug>"`),
and resolved per locale at build time into the static catalogs the app fetches.

The API no longer needs to store, validate or serve any of it. Everything below
is API-side cleanup to do **after** the front-end change has shipped — until
then the API can keep serving the fields, the front end simply ignores them.

## 1. Stop serving video data

- `SerializeConcept` — drop `video_data`.
- `SerializeAdminConcept` / `SerializeAdminConcepts` — drop `video_data`.
- `SerializeLesson` — drop `walkthrough_video_data`, and drop the `data[:sources]`
  block from the payload.
- `SerializeAdminLesson` — drop `walkthrough_video_data`.

**Check first:** these are read paths. If anything in admin _writes_ video data,
that workflow ends (video metadata becomes a curriculum edit + deploy). Confirm
before deleting.

## 2. Remove the video programming-language axis

`SerializeLesson#data` filters `sources` to those matching `user_courses.language`
(`javascript` / `python`). No seed ever set a `language` on a source, so this is
dead code, and the front end has replaced the axis with human locale. Remove:

- the `sources` filtering in `SerializeLesson#data`
- the `language` lookup it does via `user.user_courses`

`user_courses.language` itself stays — it is still the student's chosen
programming language for everything else.

## 3. Drop the storage and validation

- `db/seeds/curriculum.json` — remove the `data.sources` block from every video
  lesson. Keep `type: "video"` and the lesson's place in the syllabus.
- `app/models/concerns/has_video_data.rb` — delete; the catalog generator now
  enforces provider/id/durationSeconds/uploadDate.
- `Lesson#validate_video_data!` and the `choose_language` sources validation —
  delete. A video lesson with no video is now caught at build time in the front
  end, not at save time here.
- `lessons.walkthrough_video_data` column — drop once nothing reads it.

Progress tracking is unaffected: `user_videos` and
`user_lessons.walkthrough_video_watched_percentage` key on identity, not
metadata, and stay exactly as they are.

## 4. Concept unlocking is now only unlocking

`concepts.unlocked_by_lesson` was doing double duty: gating the concept _and_
supplying its recap video. It now only gates. That means a concept can be
unlocked by an exercise lesson without losing its video, and
`db/seeds/concepts.json` can point each concept at whatever lesson genuinely
unlocks it.

Related: PR #603 repoints `type-conversion` from `for-while-loops` to
`isbn-verifier`. That was the interim fix for the wrong video showing on the
Type Conversion concept page. With this change the video is gone regardless, so
the repoint is now purely an unlocking decision — keep it or revert it on that
basis alone.

## 5. Confirm Mux playback policy (do this first)

Lesson video sources were previously only reachable through `internal/`
(authenticated). They now ship in a public static catalog. If those Mux assets
use **public** playback policy, the catalog was effectively the paywall and
publishing it gives the course away. If they use **signed** playback, the ids
are inert and there is nothing to do.

Concept videos and project episodes were already public, so they are unaffected
either way.
