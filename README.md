# Diffvera frontend

Nuxt 4, Vue, TypeScript, Tailwind CSS, and Hugeicons. Stages one and two implement the full landing page with an authored TypeScript pull request review, How it works, Features, Architecture rules, FAQ, Final CTA, and Footer. Stage three adds GitHub sign-in and repository-connection screens. Landing-page actions lead to `/sign-in`; real GitHub authentication remains disabled. Development-stage announcements are excluded from the product UI.

From this directory:

```bash
npm ci
npm run dev
```

The development URL is printed by Nuxt (normally http://localhost:3000).

```bash
npm run typecheck
npm run lint
npm run build
npm run preview
```

Global palette, type, and focus styles live in `app/assets/css/main.css`: Raycast-inspired coral (`#ff6363`) and charcoal (`#151515`/`#202123`) on warm off-white, with deeper red variants for accessible text. Palette reference: [Raycast's official press kit](https://www.raycast.com/press). The page uses the marketing layout and components in `app/components/marketing/`; `HeroCodeAccents.vue` provides restrained code/review motifs. The preview is Vue markup with mock TypeScript code and one security finding; it does not call an API or change repository code.

App components, composables, and Vue/Nuxt APIs use Nuxt auto-imports. Domain types, services, external packages, and the icons actually used have explicit imports. Geist is served locally from `public/fonts/`; its SIL Open Font License is included alongside the font.

Product scope and stages are documented in `../docs/product.md` and `../docs/build-plan.md`.

`app/pages/index.vue` composes the hero and five main-content sections through Nuxt auto-imports. `app/layouts/marketing.vue` owns the navigation, main landmark, and `MarketingFooter.vue`. Each section has its own component under `app/components/marketing/`; FAQ and suggestion disclosures use native HTML `details`/`summary` controls.

Motion uses native browser APIs and Tailwind utilities, without an animation dependency. Hero entry and drift keyframes live in `app/assets/css/main.css`; entries start before hydration. `useMarketingMotion.ts` coordinates one-time reveals before below-fold content enters view, skipping content already visible after a fast scroll or anchor jump. It honors reduced motion, cancels reveals around keyboard focus, and cleans up observers/listeners. The page remains readable without JavaScript. Decorative hero motion is continuous, with no pause/resume UI.

Access screens use `app/layouts/auth.vue`, feature components in `app/components/auth/` and `app/components/onboarding/`, typed states in `app/types/access.ts`, and SSR-aware composables calling `app/services/access.ts`. The service currently returns disconnected states. It makes no GitHub calls and never infers a session from URL parameters.

With `npm run dev`, visit `/__preview/access` to select sign-in return and repository-connection states. Fixtures cover verified, cancelled, expired, failure, organization approval, connected repositories, empty access, and checking states. Retry actions are observable within this preview; verified-to-connection navigation remains local. Fixture data never creates or stores an authentication session. The route returns 404 in production and fixture data is omitted from production bundles. See `../docs/frontend-flows.md` for routes, state ownership, and the backend integration boundary.

Stages four and five provide the application shell, overview, repository list/detail, pull-request selection/detail, review history, commit-specific review workspace, finding feedback, architecture-rule creation/editing, and connection settings. In development, visit `/dashboard?preview=1` for the connected UI journey; the access preview also links there. A visible banner identifies authored data and the absence of authentication/live AI. Scenario links exercise empty, loading, and failed workspaces. Normal application routes require sign-in; production never enables the preview bypass.

`app/types/workspace.ts` and `app/services/workspace.ts` define the data boundary. `useWorkspace` coordinates state and actions; `app/mocks/workspace.ts` supplies a development-only typed adapter. Shared Nuxt state keeps local actions consistent across views. Manual preview reviews simulate queued/running/completed states; feedback, rules, and history remain connected during navigation. Fixture mutations reset on a full reload. No backend, real authentication, model inference, code editing, merging, or durable persistence is implemented. No application dependencies were added for these stages.

The workspace fills desktop width and uses compact metric cards. `UiSelect` replaces native selects with Hugeicons, teleported listboxes, keyboard navigation/typeahead, viewport positioning, and fade/scale transitions. The dashboard uses a Vue/Tailwind stacked bar chart derived from review records, with 7/14-day selection and hover/focus details. Its data table opens in a native dialog with focus and scroll restoration, leaving dashboard cards in place. A shared four-column grid aligns KPIs, the three-column activity chart, and the one-column attention/context stack; recent reviews span the full width. Text inputs and comboboxes use a charcoal focus border; other controls retain visible keyboard focus. Motion respects reduced-motion preferences. Only Hugeicons supply iconography; no chart package, custom SVG, stock imagery, or application dependency was added.

Text selection uses the browser default. Semantic status styles live in `app/utils/status.ts`, with theme tokens in the global CSS; completed/active/failed/queued colors match badges, dashboard bars, and workflow states. `UiSpinner` supplies the shared Hugeicons loader. `UiAsyncButton` reserves label space, exposes pending state, and blocks duplicate clicks. `useWorkspace` tracks the specific pending command through service completion and review navigation, so unrelated controls do not falsely display spinners. Rule saves lock the editor until they settle, and feedback/copy actions recover their enabled state on success or failure. Workspace fetching, sign-in/connection checks, review progress, and Nuxt page navigation also show appropriate loading indicators. Fast mock operations remain fast; no artificial delay was added to the application.

Multi-file reviews use `ReviewsFileNavigator` for searchable paths and finding counts, `ReviewsFindingFilters` for current/all-file scope and category/severity, and `ReviewsCodePane` for bounded read-only excerpts and full evidence-range highlighting. Evidence jumps preserve filters and keyboard focus. Architecture findings show readable rule names. Rule editors include boundary guidance and protect open drafts from another Add/Edit action. `app/error.vue` provides branded error recovery.

See [the frontend inspection guide](../docs/frontend-inspection.md) for routes and connected journeys. `/dashboard/reviews/review-56?preview=1&state=large` adds an authored eight-file example; the same scenario includes stable `review-35`, `review-queued`, and `review-running` routes. Backend work is deferred until the user reviews the frontend and explicitly requests that stage.
