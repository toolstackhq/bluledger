# BluLedger

BluLedger is a fictional digital banking portal built for UI demos, product prototyping, and test automation practice. It is an original desktop-first React application styled to feel like a serious customer banking workspace.

## Setup

```bash
npm install
npm run dev
```

## Demo credentials

- Customer ID: `92718463`
- Password: `Demo@1234`

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
- Rich fictional banking data loaded from `bankData.json`
- Local card, profile, settings, and transfer updates
- Recent transactions and transaction search/filtering
- Stable `data-testid` attributes for automation practice
- Responsive desktop-first layout with reusable panels, tables, and forms

## Deployment

- GitHub Pages deployment is automated with GitHub Actions on pushes to `main`.
- The app is configured for project-page hosting at `/bluledger/`.

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
