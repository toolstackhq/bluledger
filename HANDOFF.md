# BluLedger Handoff

Last verified commit: `03dae7e`

## Current status

- App repo is clean: no uncommitted changes.
- GitHub Pages deploy target: `https://toolstackhq.github.io/bluledger/login`
- GA4 is wired and active when `VITE_GA_MEASUREMENT_ID` is set.
- Systemtest suite currently passes end to end: `28 passed`

## What was just finished

### Global Automation Guide

- The Automation Guide is no longer tied to the login page.
- It now lives as a global floating widget in `src/components/AutomationGuideWidget.jsx`.
- It stays minimized by default, can be opened from any route, and can be dismissed for the current session.
- The drawer header now uses icon buttons for minimize and session-close.
- Topic answers include clickable route links so users can navigate directly to the training surface.
- The guide now includes a larger catalog of automation topics:
  - shadow DOM
  - iframe
  - retries / intermittent failures
  - downloads
  - scheduled transfers
  - persistence
  - validation
  - route guards
  - loading overlays

### Help training surface

- `Help > Environment Status` was added as an intermittent-failure page.
- It intentionally fails on attempts 1 and 2, then succeeds on attempt 3 in the current session cycle.
- This exists specifically for retry-handling automation practice.

### Analytics

- GA4 custom events already in place:
  - `login_success`
  - `help_opened`
  - `feedback_submitted`
  - `contact_support_submitted`
  - `automation_guide_opened`
  - `automation_guide_framework_selected`
  - `automation_guide_topic_selected`

## Important files

- App shell and global widget:
  - `src/App.jsx`
  - `src/components/AutomationGuideWidget.jsx`
  - `src/components/AutomationGuideDrawer.jsx`
- Guide content:
  - `src/data/automationGuide.js`
- Help routes:
  - `src/router/index.jsx`
  - `src/navigation/helpNav.js`
  - `src/pages/HelpEnvironmentStatusPage.jsx`
- System tests:
  - `systemtest/tests/automation-guide.spec.ts`
  - `systemtest/tests/help.spec.ts`
  - `systemtest/components/automation-guide-widget.ts`
  - `systemtest/AI_CONTEXT.md`

## Restart workflow

### App

From repo root:

```bash
npm install
npm run dev
```

Default local app URL:

```text
http://127.0.0.1:5173
```

If that port is busy, use a fixed alternative:

```bash
npm run dev -- --host 127.0.0.1 --port 5178 --strictPort
```

### System tests

From `systemtest/`:

```bash
npm install
npm run lint
npm run typecheck
npm test
```

If the app is running on a non-default port:

```bash
DEV_UI_BASE_URL=http://127.0.0.1:5178 npm test
```

## Current seeded primary credentials

- Customer ID: `92718463`
- Password: `Harbour!92`

## Recommended next steps

1. Add more advanced training surfaces:
   - nested iframes
   - iframe + shadow DOM
   - closed shadow DOM scenario
   - lazy-loaded grid
2. Expand the Automation Guide content alongside each new surface.
3. If analytics usage matters, review GA4:
   - `Reports > Engagement > Events`
   - look for `automation_guide_opened`
4. If the guide starts to grow further, consider:
   - search/filter inside the guide
   - grouping topics by category
   - saving framework selection across the session

## Notes for the next session

- `systemtest/AI_CONTEXT.md` is the source of truth for the Playwright framework.
- The guide is intentionally training-oriented, so realism is useful, but stability still matters more than novelty.
- Avoid reintroducing horizontal scroll in the drawer; content should wrap and only vertical scroll is acceptable.
