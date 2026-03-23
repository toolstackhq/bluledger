# AI Context

Use this file when an LLM is asked to add tests, update page objects, or maintain this framework.

## What this project is

This is a `Playwright` + `TypeScript` automation framework for the BluLedger banking demo app.

It is designed so that:

- tests describe workflows and assertions
- page objects own selectors and UI actions
- fixtures provide shared runtime objects
- the application under test lives in the parent repo root, outside `systemtest/`
- the app source of truth is the parent `src/` folder

## Architecture map

- `tests/`
  - user journeys and assertions
  - tags such as `@smoke`, `@regression`, `@critical`
- `pages/`
  - locators and user-facing actions
  - no business assertions here
- `components/`
  - reusable UI fragments if multiple pages share the same widget
- `fixtures/test-fixtures.ts`
  - shared `Playwright` fixtures
  - preferred import path for tests
- `data/factories/`
  - generic test data builders such as `DataFactory`
- `config/`
  - `TEST_ENV`, URLs, secrets, and runtime config
- `reporters/`
  - structured event output for CI and tooling
- `../src/`
  - BluLedger application source
  - use this to study routes, labels, ids, and `data-testid` values before adding tests
- `../src/data/testUsers.json`
  - fixed demo users and credentials
- `BLULEDGER_TEST_PROMPT.md`
  - app-specific prompt with automation guidance derived from the source

## Authoring rules

- Keep raw selectors out of test files.
- Put selectors in page objects.
- Keep assertions in tests.
- Do not add `waitForTimeout`.
- Prefer semantic selectors such as labels, roles, and `data-testid`.
- Use shared fixtures from `fixtures/test-fixtures.ts`.
- Extend existing page objects before creating duplicates.
- Study the parent app source before introducing selectors.

## Local run model

- `npm test` runs the suite.
- In local `dev`, Playwright can auto-start the parent BluLedger Vite app when the default local URL is still in use.
- `TEST_ENV` controls environment selection.
- The default local app URL for this suite is `http://127.0.0.1:5173`.
- The seeded primary login for local runs is customer ID `92718463` with password `Harbour!92`.
- The app can also be started manually from the parent repo root with `npm run dev`.

## Common tasks

### Add a new UI journey

1. Create or extend a page object in `pages/`.
2. Add the test under `tests/`.
3. Use fixtures.
4. Add a tag like `@smoke` if appropriate.
5. Assert in the test, not the page object.

### Fix a broken selector

1. Update the locator in the relevant page object.
2. Do not patch the test with inline selectors.
3. Keep the selector semantic and stable.

### Add a new workflow helper

1. Prefer a page-object method if it is page-specific.
2. Prefer `components/` only when multiple pages reuse the same widget behavior.
3. Keep helper names aligned with user actions, not DOM details.

## Safe changes

- Add tests
- Extend page objects
- Adjust env/config wiring carefully
- Add reporters or CI artifacts if they do not break defaults

## Changes to avoid casually

- Do not rewrite fixture boundaries without a clear need.
- Do not move assertions into page objects.
- Do not remove tags or observability defaults without intent.
- Do not replace semantic selectors with brittle CSS chains.
- Do not patch around app behavior without checking the parent `src/` implementation first.

## Commands

```bash
npm test
npm run test:smoke
npm run lint
npm run typecheck
npm run report:playwright
npm run report:allure
cd .. && npm run dev
```
