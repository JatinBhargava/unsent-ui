# Unsent UI

Unsent UI is the frontend for a writing-focused social journaling platform where users can register, log in, write diary pages, and explore public entries in a clean, minimal interface.

It is built with React, TypeScript, Vite, and Tailwind CSS, and connects to the Unsent backend for authentication and diary workflows.

## Project Links

- Frontend: [unsent-ui](https://github.com/JatinBhargava/unsent-ui)
- Backend: [unsent-core](https://github.com/JatinBhargava/unsent-core)

## Highlights

- Responsive React + TypeScript frontend built with Vite
- Authentication flow with register and login screens
- Backend integration through configurable API base URL
- OAuth entry point for Google authentication
- Writing experience for creating diary pages with draft/publish flow
- Public diary browsing experience with a minimalist reading-first layout
- GitHub Actions pipeline for build, lint, artifact upload, and Docker image workflow

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- ESLint
- GitHub Actions
- Docker

## Core Screens

- Home landing page with product positioning and CTA flow
- User registration page
- User login page
- Public diaries listing page
- Write page for creating diary entries
- Win of the Day page

## Backend Integration

This frontend is designed to work with the backend service in `unsent-core`.

- Default backend URL: `http://localhost:8081`
- Configurable via: `VITE_API_BASE_URL`
- Current integration points:
  - `POST /auth/register`
  - `POST /auth/login`
  - `GET /oauth2/authorization/google`

Backend repository:
[unsent-core](https://github.com/JatinBhargava/unsent-core)

## Local Development

### 1. Clone the repositories

```bash
git clone https://github.com/JatinBhargava/unsent-ui.git
git clone https://github.com/JatinBhargava/unsent-core.git
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Create environment configuration

Create a `.env` file in the frontend root:

```env
VITE_API_BASE_URL=http://localhost:8081
```

### 4. Start the frontend

```bash
npm run dev
```

### 5. Build for production

```bash
npm run build
```

## Available Scripts

- `npm run dev` starts the Vite development server
- `npm run build` creates the production build
- `npm run lint` runs ESLint
- `npm run preview` previews the production build locally

## CI/CD

The repository already includes a GitHub Actions workflow that:

- installs dependencies
- runs linting
- builds the frontend
- uploads build artifacts
- builds and pushes a Docker image on selected branches

This gives the project a solid base for production deployment and team-style delivery practices.

## Engineering Direction

The project already shows full-stack separation, frontend-backend integration, CI automation, and containerization. To make it even stronger for portfolio and resume use, the next upgrades should focus on production readiness:

- AWS deployment using S3 + CloudFront for the frontend and ECS or Elastic Beanstalk for services
- Infrastructure as Code using Terraform or AWS CDK
- End-to-end authentication completion for Google and GitHub OAuth
- Secure environment and secret management with AWS Secrets Manager or GitHub Environments
- Rich diary features such as edit, delete, private/public visibility, tags, search, and pagination
- AI-assisted writing that can suggest whether a new page should be added to an existing diary or started as a new thread
- AI helper features for prompts, tone refinement, summaries, and reflective writing assistance
- State and data management improvements using React Query or a similar server-state layer
- Automated testing with Vitest and React Testing Library
- End-to-end testing with Playwright or Cypress
- Observability with structured logging, monitoring dashboards, and error tracking
- Performance optimization with code splitting, asset optimization, and Lighthouse improvements
- Docker-based environment parity for local development and deployment
- Custom domain, HTTPS, and production-grade release workflow

## Suggested Future Upgrades

- Deploy frontend to AWS S3 + CloudFront
- Add backend deployment and full environment promotion strategy
- Integrate API error states, loaders, retries, and empty states
- Add user profile and personalized dashboard
- Introduce draft autosave and editor enhancements
- Add AI-powered diary organization to recommend linking new entries into existing diaries
- Add an AI writing companion for prompts, rewriting help, summarization, and journaling support
- Add analytics, usage metrics, and audit-friendly logging
- Support image attachments or rich-text diary entries
- Add role-based access and moderation tooling for public content

## Why This Project Stands Out

Unsent is more than a UI exercise. It demonstrates:

- product-oriented frontend development
- integration with a separate backend codebase
- authentication workflows
- environment-based API configuration
- CI/CD thinking
- Docker-ready delivery pipeline
- a clear path toward cloud deployment and scalable architecture

## Status

Current state:

- frontend foundation is built
- authentication screens are integrated with backend APIs
- core writing and diary browsing flows are present
- CI pipeline and Docker workflow are set up

Next milestone:

- connect all diary operations to the backend and ship a cloud-hosted production version
