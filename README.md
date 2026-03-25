# BluLedger

[![Pages](https://github.com/toolstackhq/bluledger/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/toolstackhq/bluledger/actions/workflows/deploy-pages.yml)
[![System Tests](https://github.com/toolstackhq/bluledger/actions/workflows/systemtest.yml/badge.svg)](https://github.com/toolstackhq/bluledger/actions/workflows/systemtest.yml)
[![Container](https://github.com/toolstackhq/bluledger/actions/workflows/publish-container.yml/badge.svg)](https://github.com/toolstackhq/bluledger/actions/workflows/publish-container.yml)
[![Docker Pulls](https://img.shields.io/docker/pulls/anoops90/bluledger)](https://hub.docker.com/r/anoops90/bluledger)

BluLedger is a fictional digital banking web app built for UI demos, prototyping, and automation practice.

## What It Is

- React + Vite banking demo app
- desktop-first customer workspace with seeded personas
- designed to include realistic automation challenges inside the product

## How To Access It

### GitHub Pages

Live app:

```text
https://toolstackhq.github.io/bluledger/login
```

### Docker Image

Published image:

```text
anoops90/bluledger:latest
```

Run it:

```bash
docker run --rm -p 8080:8080 anoops90/bluledger:latest
```

Run it on another port:

```bash
docker run --rm -e PORT=4173 -p 4173:4173 anoops90/bluledger:latest
```

### Run From Source

```bash
npm install
npm run dev
```

Default local URL:

```text
http://127.0.0.1:5173
```

## Included In The App

- login with seeded test users
- dashboard / account summary
- transfer money and transfer review
- transactions history and filtering
- statements with CSV and PDF export
- cards management
- customer profile
- settings and preferences
- help section with iframe, shadow DOM, retry/failure, and other automation training surfaces
- global Automation Guide widget with direct links to training routes
- performance mode with variable loading overlays

## Analytics

- optional GA4 support via `VITE_GA_MEASUREMENT_ID`
- route-level page view tracking
- custom events for key app and training flows
- analytics stays disabled when the measurement ID is not configured

## Deployment

- GitHub Pages deploys automatically from `main`
- Docker image publishes automatically from `main` as `latest`
- version tags like `v1.0.0` publish a tagged image and create a GitHub Release entry

Important GitHub Actions secrets:

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

Optional GitHub variable or secret:

- `VITE_GA_MEASUREMENT_ID`

## Contributing

- open an issue or PR for product, UI, or automation-surface improvements
- keep the app deterministic enough for automated tests
- if you change `systemtest/`, keep `systemtest/AI_CONTEXT.md` aligned

## Notes

- this is a fictional app only
- no real banking institutions, customer data, or live payments are involved
