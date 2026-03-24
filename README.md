# BluLedger

BluLedger is a fictional digital banking portal built for UI demos, product prototyping, and test automation practice. It is an original desktop-first React application styled to feel like a serious customer banking workspace.

Live app: https://toolstackhq.github.io/bluledger/login

## Setup

```bash
npm install
npm run dev
```

## Test users

- Use the `View Test Users` link on the login page to see the preloaded customer IDs, passwords, and scenario summaries.
- Personas include customers with cards, credit products, home loans, and empty-state setups such as no active cards.

## Included pages

- Login
- Dashboard / Account Summary
- Transfer Money
- Transfer Review with success modal
- Statements with PDF and CSV export
- Cards management
- Customer profile
- Transactions history
- Settings / preferences

## Features

- Protected routes with local mock session state
- Rich fictional banking data loaded from `bankData.json` and `testUsers.json`
- Multiple preloaded test-user personas with scenario-specific account and product mixes
- Local card, profile, settings, and transfer updates
- Recent transactions and transaction search/filtering
- Stable `data-testid` attributes for automation practice
- Responsive desktop-first layout with reusable panels, tables, and forms

## Deployment

- GitHub Pages deployment is automated with GitHub Actions on pushes to `main`.
- The app is configured for project-page hosting at `/bluledger/`.

## Google Analytics

- This app supports optional `GA4` page tracking for the deployed GitHub Pages site.
- For local or committed config, copy `.env.production.example` to `.env.production` and set `VITE_GA_MEASUREMENT_ID` to your GA4 Measurement ID, for example `G-XXXXXXXXXX`.
- For GitHub Pages builds, you can also set a repository variable or secret named `VITE_GA_MEASUREMENT_ID`; the deploy workflow will pass it into the production build.
- The integration loads the Google tag once and sends `page_view` events on route changes.
- If the env var is missing, analytics stays disabled.

## Folder structure

```text
src/
  components/
  context/
  data/
  pages/
  router/
  styles/
  utils/
```

## Notes

- This project is fictional only.
- No real banking institutions, customer data, or live payments are used.
