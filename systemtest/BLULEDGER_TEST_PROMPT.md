Use this prompt together with [AI_CONTEXT.md](/home/anoop/Documents/dev/BluLedger/systemtest/AI_CONTEXT.md) when adding or maintaining Playwright coverage for BluLedger.

# BluLedger Automation Prompt

You are working on the BluLedger system test suite in `/home/anoop/Documents/dev/BluLedger/systemtest`.

The application under test is the parent Vite React app in `/home/anoop/Documents/dev/BluLedger`, not the old template demo app.

## App model

- BluLedger is a client-side React banking demo app.
- The app source lives in `../src`.
- Local app start command from the app root is `npm run dev`.
- The login route is `/login`.
- Successful login navigates to `/dashboard`.
- Protected routes redirect unauthenticated users to `/login`.

## Auth model

- Authentication is local and handled in `../src/context/AppContext.jsx`.
- Test users are stored in `../src/data/testUsers.json`.
- The primary demo user is:
  - Customer ID: `92718463`
  - Password: `Harbour!92`
- Login state is stored in browser local storage:
  - `bluledger-app-state-v2`
  - `bluledger-remembered-id`
- Playwright tests should assume a fresh browser context per test and should not rely on persisted local storage from previous runs.

## Stable selectors and assertions

Prefer semantic selectors first, then app-owned `data-testid` or stable ids from the source.

Login page:

- Customer ID input: label `Customer ID`, `data-testid="login-customer-id"`
- Password input: label `Password`, `data-testid="login-password"`
- Submit button: role button `Sign in`, `data-testid="login-submit"`
- Invalid login form error: `#login-form-error`
- Test users button: `data-testid="login-view-test-users"`
- Test users modal: `data-testid="login-test-users-modal"`

Post-login shell:

- Dashboard heading: role heading level 1 `Account Summary`
- Signed-in customer name: `#active-customer-name`
- Logout button: `data-testid="logout-button"`
- Accounts table: `data-testid="dashboard-account-summary"`
- Main nav:
  - Accounts: `#top-nav-dashboard`
  - Payments: `#top-nav-transfers`
  - Transactions: `#top-nav-transactions`
  - Statements: `#top-nav-statements`
  - Cards: `#top-nav-cards`
  - Profile: `#top-nav-profile`
  - Settings: `#top-nav-settings`

## Source-backed behavior notes

- `LoginPage.jsx` trims the customer ID before submit.
- Empty fields show inline validation errors.
- Invalid credentials show `Customer ID or password is incorrect.`
- Successful login calls `navigate("/dashboard")`.
- `TopHeader.jsx` shows the signed-in user name and logout button.
- `DashboardPage.jsx` renders the `Account Summary` heading and account summary table.

## Test authoring rules

- Keep raw selectors out of tests. Put them in page objects.
- Keep assertions in test files.
- Prefer asserting route + page heading + one authenticated shell element after login.
- Use the real seeded demo credentials from `testUsers.json` unless the task requires a different user.
- Do not depend on generated template demo app behavior under `demo-apps/`.
- Do not use `waitForTimeout`.

## Recommended first login assertion set

After signing in with `92718463 / Harbour!92`, assert:

- URL contains `/dashboard`
- heading `Account Summary` is visible
- `#active-customer-name` contains `Alicia Warren`
- the dashboard accounts table is visible
