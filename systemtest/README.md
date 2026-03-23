# BluLedger System Tests

This folder contains the Playwright + TypeScript system test suite for BluLedger.

## Provenance

- This test framework was generated from the QA Patterns Playwright template (`qa-patterns` / PW template).
- The BluLedger-specific tests and page objects currently in this repo were written with Codex.

## What this suite targets

- The application under test is the parent BluLedger app in `../`.
- The app source lives in `../src`.
- The suite starts the local BluLedger Vite app for test runs when needed.

## Core rules

- Put tests in `tests/`.
- Put selectors and UI actions in `pages/`.
- Keep assertions in test files.
- Read `AI_CONTEXT.md` first before extending the suite.
- Use `BLULEDGER_TEST_PROMPT.md` for app-specific automation guidance derived from source.

## Main commands

```bash
npm install
npm test
npm run typecheck
npm run report:playwright
```

To run the application manually from the BluLedger repo root:

```bash
cd ..
npm install
npm run dev
```

## Current critical coverage

- login success
- auth guard redirect and invalid login
- transfer validation
- immediate own-account transfer
- future-dated payee transfer
- cards state updates
- profile validation and persistence
- settings persistence
- transactions filtering
- statement export downloads

## CI intent

This suite is intended to live inside the main BluLedger repo and run in CI on pushes to that repository.
