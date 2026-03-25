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

## Docker

- A production image is built from the repo `Dockerfile`.
- Default container port is `8080`.
- The app is served as an SPA through `nginx`, including client-side route fallback.
- Once the `Publish Container` GitHub Actions workflow runs successfully, the published image is available as:

```text
<dockerhub-username>/bluledger:latest
```

Run the published image:

```bash
docker run --rm -p 8080:8080 <dockerhub-username>/bluledger:latest
```

Build locally:

```bash
docker build -t bluledger:latest .
```

Run locally:

```bash
docker run --rm -p 8080:8080 bluledger:latest
```

Run with a different internal and exposed port:

```bash
docker run --rm -e PORT=4173 -p 4173:4173 bluledger:latest
```

If you publish to Docker Hub under your account, the resulting run command will look like:

```bash
docker run --rm -p 8080:8080 <dockerhub-username>/bluledger:latest
```

### Docker image publishing

- GitHub Actions workflow: `.github/workflows/publish-container.yml`
- It publishes `latest` from `main` and also pushes version tags like `v1.0.0`.
- The image name is:

```text
<DOCKERHUB_USERNAME>/bluledger
```

Before the workflow can push images, create these GitHub repository secrets:

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

To prepare those:

1. Create or use a Docker Hub account.
2. Create a Docker Hub access token from Docker Hub account settings.
3. In GitHub, open `Settings > Secrets and variables > Actions`.
4. Add:
   - `DOCKERHUB_USERNAME` = your Docker Hub username
   - `DOCKERHUB_TOKEN` = the Docker Hub access token

Optional:

- If you want GA4 in the container build too, keep `VITE_GA_MEASUREMENT_ID` configured as a GitHub variable or secret.

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
