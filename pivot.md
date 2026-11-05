# Pivot: finite Coding Fundamentals course

## Context (read this first)

**The decision.** Jiki is not going to make enough money to justify building it out further, so it
is being pivoted from an open-ended platform into one finished product: the Coding Fundamentals
course. It takes a learner roughly 2-3 months. Everything that implied ongoing expansion is being
removed, and what remains is finished properly and then left running with minimal maintenance.

**What changes, in one line each:**

- Learn to Build (projects, episodes, livestreams, the `/build` hub, the roadmap) is removed
  entirely, not hidden.
- The last 3 of the 20 levels (`dictionaries`, `changing-dictionaries`, `everything`) get finished
  and published. "Coding Fundamentals" stays as the course name.
- Premium changes from a monthly/annual subscription to a one-off lifetime purchase (around $25 USD
  base, scaled by purchasing-power parity). Existing subscribers are converted to lifetime.
- The landing page is rewritten around a finite course with a stated duration.
- The welcome video modal is removed. A new external / landing video is recorded.
- Once all copy is frozen, translations are finished for the locales that are kept.
- Exercism becomes the explicit "what next" after the course.

**Why the ordering matters.** Translation is the most expensive step and multiplies by every locale,
so copy must be frozen first. Do content and product changes, then pricing, then landing page, then
videos, then translate once.

**Open decisions (not yet made, do not assume):** the final base price and PPP scaling, the
Ask Jiki cap for lifetime users, the refund policy, which locales are kept, whether Exercism
Insider/Bootcamp entitlements still grant lifetime Premium, and whether guides stay.

**Repos involved.** This monorepo (`app/` Next.js front-end, `curriculum/`, `content/`,
`content-renderer/`, `llm-chat-proxy/`, `interpreters/`), plus `../api` (Rails: Stripe, emails,
entitlements, Ask Jiki access) and `../terraform` (billing cap, KV for chat quotas). File paths
below are relative to this repo unless prefixed with `api/`.

**Useful facts discovered while building this list:**

- Levels registry: `curriculum/src/levels/index.ts`. Publish cutoff: `LAST_PUBLISHED_LEVEL_SLUG`
  in `app/lib/constants/course.ts` (currently `building-arrays`). 107 exercises total.
- Projects/episodes are front-end content only. The API has no models for them, no badges, no cron.
- Premium gating server-side covers Challenges and Ask Jiki only. Guides and episodes are gated in
  the front-end.
- Ask Jiki limits live in three places: `api/app/commands/assistant_conversation/check_user_access.rb`
  (free = one lesson conversation ever), `llm-chat-proxy/src/usage.ts` (100/day, 500/month), and
  `content/src/posts/articles/fair-usage-jiki-ai-policy/source.md`. Change all three together.
- PPP table: `api/config/initializers/pricing.rb` (~105 currencies, monthly + annual minor units).
- No refund policy exists anywhere and the terms of service have no payment clauses.
- All app UI strings are in the single catalog `app/messages.json`; per-locale JSON is generated.
- Locale set is inconsistent: 11 in `app/lib/locales.ts`, all 11 marked production, but only
  en/fr/hi/uk have published app catalogs and only fr reports complete. `hi` is published but not
  in `ALL_LOCALES`.
- The `welcome-to-coding-fundamentals` video lesson is NOT the welcome modal. It stays, because it
  doubles as the language picker.

**How to use this file.** Pick a section, tick items as they land, commit the tick with the work.
Work on feature branches prefixed `ihid-`. Keep sections in this order when adding items.

Suggested order: finish the 3 levels -> strip Learn to Build -> pricing model -> landing/marketing
copy -> videos -> freeze copy -> translations -> docs/cleanup.

## Finish the last 3 levels

Registry is `curriculum/src/levels/index.ts` (20 levels). `LAST_PUBLISHED_LEVEL_SLUG` in
`app/lib/constants/course.ts` is `building-arrays`, so `dictionaries` (2 exercises),
`changing-dictionaries` (8) and `everything` (6) are unpublished. All 16 have instructions and
scenarios already.

- [ ] Review and finish the 2 `dictionaries` exercises (content, hints, llm-metadata, solutions, scenarios)
- [ ] Review and finish the 8 `changing-dictionaries` exercises
- [ ] Review and finish the 6 `everything` exercises
- [ ] Record / confirm the video lessons for the 3 levels (`curriculum/src/videos/videos.json`, `curriculum/src/video-lessons/messages.json`)
- [ ] Decide on deep-dive videos for the 3 levels (12 YouTube deep dives exist today, none for these levels)
- [ ] Decide fate of the planned moving-house capstone (memory says it was planned for building-arrays)
- [ ] Bump `LAST_PUBLISHED_LEVEL_SLUG` to `everything` (publishes sitemap entries and dashboard milestones)
- [ ] Remove or repurpose `ComingSoonCard.tsx` ("More Lessons Coming Soon") since the course now ends; show the certificate card instead
- [ ] Review `CompletionCert.tsx` and certificate generation so finishing level 20 actually issues the certificate
- [ ] Update `modals.levelMilestone.*` copy ("unlock the next level and continue your learning journey") for the final level
- [ ] Add an end-of-course "what next" (Exercism CTA) after the final level
- [ ] Update `dashboard.exercisePath.comingSoon` / `start` / `milestone` copy
- [ ] Drop the stuckometer / progression-metrics work (PR #864) from any roadmap, or explicitly keep it as-is with no further work
- [ ] Define "done" for each level in writing so scope does not creep

## Remove Learn to Build

### Routes and sitemap

- [x] Delete `/build` route (`app/app/(hybrid)/[locale]/build/page.tsx`) and `components/build/*` (BuildHubPage, UpcomingStreams)
- [x] Delete `/projects/[slug]` and `/projects/[slug]/episodes/[episodeSlug]` routes
- [x] Delete `components/projects/*` (ProjectCard, ProjectPage, EpisodeCard, EpisodePage, EpisodeSummary, EpisodeVideo, RelevantGuidesSection, useEpisodeProgress)
- [x] Delete `app/app/calendar.ics/route.ts` and `lib/calendar/buildScheduleIcs.ts` (livestream calendar) and the `modals.calendarSubscribe` modal + keys
- [x] Remove `/build`, `/roadmap`, `projectEntries()` from `app/app/sitemap.ts`
- [x] Remove `build` and `roadmap` from `lib/i18n/routes.ts`
- [x] Remove `/build`, `/projects` from `PUBLIC_SECTIONS` and `/roadmap` from `PUBLIC_PAGES` in `lib/i18n/config.ts`
- [x] Update `lib/cache/cacheable-routes.ts`
- [x] Add 301 redirects in `next.config.ts` for `/build`, `/projects/*`, `/roadmap` (these are indexed and linked from blog posts)
- [x] Remove `/help/how-projects-work` legacy redirect if no longer needed (kept: it is about Challenges, not Learn to Build)
- [x] Remove project asset paths from `lib/assets-paths.ts` and the doc example in `lib/static-asset.ts`

### Content loading layer

- [x] Delete `lib/content/getAllProjects.ts`, `getProject.ts`, `getProjectEpisode.ts`
- [x] Remove project/episode assembly from `lib/content/contentMeta.ts` (~20 refs) and `ProjectMeta`/`EpisodeMeta`/`EpisodeSummary`/`ProcessedEpisode`/`episodeCount` from `lib/content/types.ts` and `index.ts`
- [x] Remove project/episode validation from `lib/content/validator.ts`
- [x] Remove project caching from `app/scripts/generate-content-cache.js`
- [x] Remove "project episodes" handling from `content-renderer/src/posts.ts` and `src/index.ts`
- [x] Remove Video (episode) and Course (project) JSON-LD builders from `lib/seo/schemas.ts`
- [x] Remove `locked_episode`, `locked_episode_video`, `project_page_all_locked` from `lib/analytics.ts`

### Guides cross-links

- [x] Delete `components/guides/FeaturedInProjects.tsx` and `getFeaturedInEpisodes()` in `GuideDetailPage.tsx`; remove its render in `GuideDetailContent.tsx`
- [x] Remove `guides.featuredInProjects.heading` key
- [x] Decide whether guides (currently in the Learn to Build sidebar group) stay, and where they live (kept, moved into the Learn to Code sidebar group)

### Navigation

- [x] Remove the `learnToBuild` group from `components/layout/sidebar/Sidebar.tsx`; move `guides` (if kept); decide whether the remaining group keeps the "Learn to Code" label or becomes unlabelled
- [x] Remove `layout.sidebar.groups.learnToBuild` and `layout.sidebar.nav.build` keys
- [x] Remove the Roadmap link from `components/layout/ExternalFooter.tsx` and `layout.footer.about.roadmap`
- [x] Delete `app/icons/learning-computer.svg` if no longer used

### Roadmap page

- [x] Delete `/roadmap` route, `components/roadmap/*` (RoadmapPage, roadmap.data.ts) and all 47 `roadmap.*` keys plus `seo.roadmap.*`
- [x] Ensure nothing else promises Python track, SQL, "Milestones 6-10", beta→live, or more spoken languages

### Landing page

- [ ] Remove `TwoHalves.tsx` (+ `two-halves/TechRow.tsx`) "two halves of being a developer" section, or rewrite it as a single-track section
- [ ] Remove `track-cards/LearnToBuildCard.tsx`, `track-cards/live-qa/*`, and `landing.learnToBuild.*` (24 keys); rework `TrackCardsSection.tsx` for a single card or fold `LearnToCodeCard` into the hero
- [ ] Remove "Build real projects / portfolio" outcome from `OutcomesSection.tsx` and `outcomes/ProjectsVisual.tsx`; remove `landing.outcomes.portfolioBody`
- [ ] Rewrite `PrintRow.tsx` / `print-row/JoinDoodle.tsx` copy (`landing.printRow.body`, `landing.printRow.projects`)
- [ ] Rewrite FAQ answers `landing.faqs.q1Item1`, `q2a`, `q4a2` in `FAQs.tsx`
- [ ] Delete `landing-page/assets/project-screens/*.webp` and `landing-page/icons/build.svg`
- [ ] Change `landing.hero.headline` "learn to code & build"

### Premium feature lists that mention Learn to Build

- [x] `components/premium/pricing.data.ts`: remove `buildWithJeremy`, `buildingFundamentals*`, `firstEpisodes`, `sampleEpisode` rows and their keys
- [x] `PremiumUpgradeModal/PremiumPlanSection.tsx`: remove `featureLearnToBuild`; remove episode-uuid upgrade context in `PremiumUpgradeModal/index.tsx`
- [x] Rewrite `modals.welcomeToPremium.description` (mentions Projects + Learn to Build)
- [x] Rewrite `challenges.description` ("Build real applications and games") if that framing no longer fits (kept: it describes Challenges, which stay)

### SEO and discovery files

- [x] Rewrite `app/public/llms.txt` and `llms-full.txt` (two strands, Learn to Build, `/build`, `/roadmap`)
- [x] Change org description "Learn to code and build in the LLM-era" in `lib/seo/schemas.ts`
- [x] Update `seo.home.*` and delete `seo.build.*`
- [x] Update `app/manifest.ts` description if it mentions building (it did not)

### Content repo

- [x] Delete `content/src/posts/projects/**` (config, messages.json, 3 projects, 2 episode dirs)
- [x] Delete `content/images/projects/**` and `content/images/build/**`, and the published copies under `app/public/static/images/projects/` and `images/build/`
- [x] Remove Projects / "Build with Jeremy" sections from `content/AGENTS.md` and `content/CLAUDE.md`
- [x] Edit `articles/faqs/source.md` (lines 16, 20, 32: premium unlocks Learn to Build, "ongoing", "first session mid-June")
- [ ] Edit `articles/support/source.md` (premium livestream Q&A perk) (left as is: livestreams are still a Premium feature until the pricing pass decides otherwise)
- [x] Fix or footnote blog links: `blog/translatathon` (links to a project episode), `blog/jiki-is-10-days-old`, `blog/how-to-get-into-tech-in-2026` ("learn to build things with me"); review `the-backstory-of-jiki` and `hello-world` "projects from day one"

### API repo (`jiki/api`)

- [ ] Rewrite the onboarding drip: `config/locales/mailers/onboarding_mailer.en.yml` (premium pitch lists Learn to Build; `building` email is entirely projects + livestreams; `overview` references it) plus `el`, `bn`, `uk` translations
- [ ] Remove or replace the `building` drip email: `app/views/onboarding_mailer/building.*`, `User::Notifications::OnboardingBuildingNotification`, and `User::Onboarding::CreateDueNotifications`
- [ ] Edit `account_mailer` welcome email (references projects/video)

### Tests

- [x] Delete / update: `tests/unit/app/sitemap.test.ts`, `components/projects/*`, `lib/content/contentMeta.test.ts`, `content/content-validation.test.ts`, `content/validator.test.ts`, `lib/calendar/buildScheduleIcs.test.ts`, `lib/seo/schemas.test.ts`, `lib/i18n/localeRouting.test.ts`, `lib/cache/cacheable-routes.test.ts`, `content-renderer/tests/renderer.test.ts`

## Change Premium to a one-off payment

### Decisions first

- [ ] Decide base price (proposal: $25 USD; consider higher since it is a 2-3 month course) and how the PPP table scales (`api/config/initializers/pricing.rb` has ~105 currencies at monthly/annual)
- [ ] Decide what Premium includes now: Ask Jiki (capped?), Challenges, premium guides, certificates, ad-free, badge
- [ ] Decide the Ask Jiki cap for lifetime users (proxy currently 100/day, 500/month per user in `llm-chat-proxy/src/usage.ts`); a per-user lifetime budget may be safer than daily/monthly alone
- [ ] Decide migration for existing subscribers (proposal: convert active subscribers to lifetime, cancel Stripe subscriptions, email them)
- [ ] Decide whether Exercism Insider / Bootcamp entitlements (`premium_entitlement.rb`) still grant lifetime Premium
- [ ] Decide refund policy (none exists anywhere today)

### API (`jiki/api`)

- [ ] Add a one-off Stripe Price per currency (replace `stripe_premium_monthly_price_id` / `annual` config) and rewrite `PREMIUM_PRICES` in `config/initializers/pricing.rb` to a single amount per currency
- [ ] Change `Stripe::CreateCheckoutSession` from `mode: subscription` to `mode: payment`; update `DetermineSubscriptionDetails`, `VerifyCheckoutSession`
- [ ] Replace webhook handlers (`subscription_created/updated/deleted`, `invoice_payment_*`) with `checkout.session.completed` / `payment_intent.succeeded` handling that grants a permanent entitlement
- [ ] Remove `UpdateSubscription`, `CancelSubscription`, `ReactivateSubscription`, `CreatePortalSession`, `SyncSubscriptionToUser`, `UpdateSubscriptionsFromInvoice` and their routes in `internal/subscriptions_controller.rb`
- [ ] Add a `stripe` premium entitlement with no expiry (or a new `lifetime` source) via `PremiumEntitlement`; keep `Payment` records
- [ ] Migrate `User::Data` subscription columns (`stripe_subscription_id/status`, `subscription_interval/status/valid_until`, `subscriptions` jsonb) or leave them dormant
- [ ] Remove `DowngradeToStandard` triggers tied to subscription lapse; keep it only for admin use
- [ ] Update `external/pricing_controller.rb` to return a single price
- [ ] Write a one-off migration script: active subscribers → lifetime entitlement, cancel their subscriptions in Stripe, send an email
- [ ] Remove `premium_mailer/subscription_ended` and update `welcome_to_premium`
- [ ] Update the onboarding `premium` drip email (PPP "two takeaway drinks" line, monthly framing)
- [ ] Update API tests under `test/commands/stripe/**` and `test/controllers/webhooks/stripe_controller_test.rb`

### Front-end data layer

- [ ] `lib/pricing.ts`: drop `BillingInterval`, make `PremiumPrices` a single amount; remove `formatMonthlyPrice()`
- [ ] `types/subscription.ts` / `types/auth.ts`: collapse `SubscriptionStatus` (7 values) to premium / not premium; drop `interval`
- [ ] `lib/api/subscriptions.ts`: keep createCheckoutSession + verifyCheckoutSession; remove portal, update, cancel, reactivate
- [ ] `lib/subscriptions/handlers.ts`, `checkout.ts`, `verification.ts`: simplify to buy + verify
- [ ] `lib/api/apiErrors.tsx` and `apiErrors.*` keys: remove `existing_subscription`, `invalid_interval`, `cancel_failed`, `reactivate_failed`, `portal_failed`
- [ ] `lib/api/payments.ts` / settings payment history: drop "Recurring" type
- [ ] Update `tests/mocks/user.ts` `premium_prices` fixture

### Price rendering

- [ ] `components/common/PremiumPrice.tsx`: remove `PremiumDailyPrice` ("only Xp a day")
- [ ] `components/landing-page/MonthlyPrice.tsx`: rename and render a one-off price
- [ ] `components/premium/PlanPrice.tsx`: replace "per month" with "one-off" / "lifetime access"; remove `premium.planPrice.perMonth`, `common.perMonth`
- [ ] `components/premium/PublicPremiumPrice.tsx`

### Premium page and modals

- [ ] `components/premium/pricing.data.ts` + `PricingTable.tsx`: rewrite free vs premium matrix for the new feature set
- [ ] `components/premium/FaqSection.tsx` + `premium.faq.*` (11 keys: minimum contract, billed monthly, cancellation) → rewrite for one-off (what you get, is it really lifetime, refunds, PPP)
- [ ] `premium.cta.*`, `premium.benefits.*`, `premium.features.*`, `premium.values.*`, `premium.categories.*` copy review
- [ ] `PremiumUpgradeModal/*`: remove `dailyNote`, `useUpgradeFlow.ts` hardcoded `interval: "monthly"`
- [ ] `SubscriptionCheckoutModal*`: "Billed monthly. Cancel anytime." and "/mo" → one-off wording
- [ ] Delete `SubscriptionModal.tsx` plan picker (chatGate / featureGate / settings variants) or reduce to a single option
- [ ] `SubscriptionSuccessModal.tsx`: remove auto-renewal notice (`modals.subscriptionSuccess.*`, 17 keys; `modals.subscription.*`, 15 keys)
- [ ] `WelcomeToPremiumModal.tsx` copy
- [ ] `subscription.tiers.*` (13 keys, "1 AI help per month") rewrite
- [ ] `toasts.subscription.*` (10 keys) prune

### Settings

- [ ] `components/settings/tabs/SubscriptionTab.tsx` and `settings/subscription/*`: replace the 9-state subscription section with "Free / Premium (lifetime)" + payment history; delete `CancelSection.tsx`, `BenefitSection.tsx` "Resubscribe", `CancelSubscriptionConfirmModal.tsx`, `CancelSubscriptionSuccessModal.tsx`
- [ ] `settings/ui/SubscriptionStatus.tsx`, `SubscriptionButton.tsx`: remove "£X/month… next billing date"
- [ ] Remove `settings.subscriptionStatus.*` (22), `settings.cancelConfirm.*` (10), `settings.cancelSuccess.*` (5), `settings.cancelSectionPanel.*` (3); rewrite `settings.premiumUpsell.*`, `settings.neverSubscribed.*`, `settings.benefits.*`
- [ ] `components/checkout/CheckoutReturnHandler.tsx` still works for payment mode

### Ask Jiki gating

- [ ] Decide free tier: keep "one lesson conversation ever" (`api/app/commands/assistant_conversation/check_user_access.rb`) or change
- [ ] `llm-chat-proxy/src/usage.ts`: add whatever lifetime or tighter cap is decided; update `FRONTEND_UPDATE.md`
- [ ] `chat-panel-states/*` and `ChatUsageNotice.tsx` copy: "Just <price>!" and fair-use wording for the new model
- [ ] `content/src/posts/articles/fair-usage-jiki-ai-policy/source.md`: update limits and "Premium includes more generous AI usage"

### Content and legal

- [ ] `articles/faqs/source.md`: "priced by country", "billed monthly", cancel/downgrade answers, Bootcamp "Premium for Life"
- [ ] `articles/support/source.md`: "Billing, payments, or subscription issues?"
- [ ] `articles/terms-of-service/source.md`: add purchase, lifetime-access, and refund clauses (none exist)
- [ ] Write a refund policy (new article or a section in terms)
- [ ] `landing.faqs.q1a2` "Jiki Premium is <price> (priced by country)" and `q5a2` "Premium for Life … and future courses"

### Docs and dev harness

- [ ] Rewrite `app/.context/stripe.md` (264 lines of subscription states) and the business-model line in `.context/about-jiki.md`; touch `settings-page.md`, `modals.md`, `auth.md`, `toasts.md`
- [ ] Delete or simplify `app/app/dev/stripe-test/**` (per-state actions, portal, delete history) and `dev/subscription-modal-test`
- [ ] Update tests: `lib/pricing`, `formatCurrency`, `externalPricing`, `subscriptions`, `useExternalPremiumPrices`, `subscriptions/checkout`, `verification`, `apiErrors`, `analytics`, `PremiumPrice`, `MonthlyPrice`, `settings/subscription/*`, `SubscriptionStatus`, `SettingsPage`, `integration/settings/payment-verification`

## Update the landing page

> **PROVISIONAL. Do not act on this section.** Everything below is a first-pass list and has not
> been agreed. An LLM must not start any of these items while this note is present. Jeremy will
> remove this note when the landing page direction is decided.

- [ ] Reposition the hero: finite course, "learn the fundamentals of coding in about 10 weeks", one-off price; rewrite `landing.hero.headline` and `tagline` ("stay relevant in {year}")
- [ ] Replace the hero Mux video (`hero/HeroVideo.tsx`, playback id and poster on assets.jiki.io; Mux title "Waiting Page 1") with the new external recording
- [ ] Rewrite `landing.twoHalves.codeBody` "hundreds of exercises and projects" (107 exercises)
- [ ] Rewrite `landing.funPrints.sub` "hundreds like them by the end" and `footnote` "that's just the first few weeks!"
- [ ] Review `landing.learnToCode.callouts.next` "Always one step up"
- [ ] Rewrite `landing.faqs.q2a` duration ("12–20 weeks at 5–10 hours a week") to the real 2-3 months
- [ ] Rewrite `landing.printRow.free` "100+ Hours of Free Content" (verify or replace)
- [ ] Rework `OutcomesSection.tsx` to certificate + understanding (drop portfolio)
- [ ] Keep `Exercism.tsx` and strengthen it as the "what next" after the course
- [ ] Review `MeetJeremy.tsx` copy for livestream / building references
- [ ] Review `LatestNewsSection.tsx` (blog posts pitching Learn to Build will surface here)
- [ ] `seo.home.title/description`, `app/manifest.ts`, OG image if it says "code & build"
- [ ] Review `layout.externalHeader` / `ExternalFooter.tsx` link set (About, Premium, Testimonials, FAQs, YouTube) once Roadmap is gone
- [ ] Review `content/src/posts/articles/beta-phase/source.md` and any remaining "beta" framing (`beta_user` badge copy)
- [ ] Review `content/src/posts/articles/who-makes-runs-jiki/source.md` for scope claims

## Videos

- [ ] Record the new external / landing video and upload to Mux; swap playback id and poster in `hero/HeroVideo.tsx`
- [ ] Remove the welcome video: delete `lib/modal/modals/WelcomeModal.tsx` + css, `components/WelcomeModalHandler.tsx`, its mount in `app/(app)/layout.tsx`, `showWelcomeModal` in `lib/modal/app.ts`, `"welcome-modal"` in `modals/app.ts`, the `welcome_modal` flag in `lib/api/flags.ts`, `modals.welcome.*` keys (6), `dev/welcome-modal-test`, and tests (`WelcomeModal.test.tsx`, `flags.test.ts`, the mock in `e2e/badge-reveal.test.ts`)
- [ ] Remove the `welcome_modal` flag server-side in the API if it is stored there
- [ ] Keep the `welcome-to-coding-fundamentals` video lesson (it doubles as the language picker in `components/lesson/Lesson.tsx`) but re-record if it references building or livestreams
- [ ] Sweep all 37 Mux lesson videos and 12 YouTube deep dives for spoken references to Learn to Build, livestreams, subscriptions, or "more levels coming"
- [ ] Resolve the YouTube view-counting experiment (`app/app/dev/youtube-view-counting/`, untracked) and delete the dev page once decided
- [ ] Delete `dev/ltc-video` if the landing animated demo changes

## Freeze copy, then finish translations

Do every item above before this section. Locales: `app/lib/locales.ts` lists 11
(en, bn, el, es-419, es-ES, fr, hu, it, pt-PT, pt-BR, uk); `production-locales.json` serves all 11.

- [ ] Decide the final locale set (11 in code today, 19 dirs under `content/copy/`, memory mentions a 50-locale plan); prune `ALL_LOCALES` and `production-locales.json` to what will actually be finished
- [ ] App UI catalog: only en, fr, hi, uk published under `static/i18n/app/`; produce bn, el, es-419, es-ES, hu, it, pt-BR, pt-PT (hi is published but not in `ALL_LOCALES`, reconcile)
- [ ] Exercise prose: fr 93/107, uk 93/107, hi 82/107, everything else 0; complete for every kept locale, including the 16 newly published exercises
- [ ] Fix `completeness.json` so it reports every production locale, not just fr, and make `pnpm locales:verify` gate on it
- [ ] i18n_TODO.md: the 8 IO-runtime exercises (`even-or-odd, leap, lower-pangram, lunchbox, raindrops, two-fer, llm-response, lookup-time`) fail to load in non-en locales; implement the `{key, params}` IO-runner mechanism
- [ ] i18n_TODO.md: cover `codeChecks[].errorHtml` and `availableFunctions[].description`
- [ ] i18n_TODO.md: undo the pilot shortcuts (optional `i18n` field on `ExerciseDefinition`, separate `i18n-{locale}.json` artifact, pack caching)
- [ ] i18n_TODO.md: interpreter de-bundling + injected locale dicts (`interpreters/i18n_interpreter_brief.md`)
- [ ] i18n_TODO.md: cross-package validator + CI merge gate; extend `app/scripts/seed-language.js` to stub exercise instructions
- [ ] i18n_TODO.md: locale-prefixed unsubscribe links in API emails
- [ ] Concepts: 52 concepts are English only; translate for kept locales
- [ ] Content posts: articles (faqs, support, terms, privacy, fair-usage, how-challenges-work at minimum) translated for kept locales; decide whether blog posts are translated at all
- [ ] Badges, levels, video-lesson titles, testimonials catalogs for kept locales
- [ ] API email translations (`onboarding_mailer.{el,bn,uk}.yml` exist; others do not) after the drip rewrite
- [ ] Remove the "Coming soon" language badge (`settings.language.comingSoon*`, `layout.externalHeader.languageComingSoon*`) once every served locale is complete
- [ ] Video subtitles / localized video sources for kept locales (`videos.json` per-locale sources) or accept English video with translated UI

## Existing users and communication

- [ ] Email active subscribers about the change (converted to lifetime, no further charges)
- [ ] Blog post announcing the finished course and the new pricing
- [ ] Post in the forum (jiki.io/r/forum) and Exercism community
- [ ] Update Stripe dashboard: archive subscription prices, set up one-off prices, customer portal config
- [ ] Check anyone with progress on episodes (front-end only, `useEpisodeProgress`) loses nothing that matters

## Freeze the stack and set a maintenance budget

- [ ] Write down monthly run cost (Cloudflare Workers/R2/KV, AWS ECS/RDS/SES, Discourse, Gemini, Sentry, Mux, YouTube) and a kill criterion
- [ ] Confirm `terraform/google/billing-cap.tf` cap matches the new Ask Jiki exposure
- [ ] Decide Next 16 upgrade now or never (`reference_next16_upgrade` memory); pin dependencies
- [ ] Quiet Sentry alerting and dependency bots to a level you will actually read
- [ ] Reduce `config/recurring.yml` and GitHub workflows to what is still needed (content.yml still watches `content/**`)
- [ ] Set the support expectation in `articles/support/source.md` (forum, bug reports, Ask Jiki)

## Docs cleanup

- [ ] `app/CLAUDE.md` / `AGENTS.md` and `.context/about-jiki.md`: describe the product as a finite course, one-off pricing
- [ ] `content/AGENTS.md`, `content/CLAUDE.md`: remove Projects structure
- [ ] `app/.context/seo.md`, `i18n.md`, `i18n-ui-strings-plan.md`: remove build/roadmap/subscription references
- [ ] Update memory notes: Learn to Code / Learn to Build naming, moving-house capstone, stuckometer, i18n overhaul leftovers
