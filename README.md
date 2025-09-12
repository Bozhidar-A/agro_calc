# Agro Calc

A modern web application for agricultural calculations, built with Next.js, TypeScript, and Tailwind CSS.

**Live hosted on a VPS with k8s @** [https://agro-calc.musaka.top](https://agro-calc.musaka.top)

<!-- Build & Deployment Status -->
[![Build & Publish](https://github.com/Bozhidar-A/agro_calc/actions/workflows/docker-publish.yaml/badge.svg?branch=release)](https://github.com/Bozhidar-A/agro_calc/actions/workflows/docker-publish.yaml)
[![Docker Build](https://img.shields.io/github/actions/workflow/status/Bozhidar-A/agro_calc/docker-publish.yaml?branch=release&label=docker%20build&logo=docker&logoColor=white)](https://github.com/Bozhidar-A/agro_calc/actions/workflows/docker-publish.yaml)
[![Docker Image](https://img.shields.io/badge/docker-ghcr.io-2496ED?logo=docker&logoColor=white)](https://github.com/Bozhidar-A/agro_calc/pkgs/container/agro_calc)

<!-- Code Quality & Testing -->
[![Tests](https://img.shields.io/github/actions/workflow/status/Bozhidar-A/agro_calc/docker-publish.yaml?branch=release&label=tests&logo=jest&logoColor=white)](https://github.com/Bozhidar-A/agro_calc/actions/workflows/docker-publish.yaml)
[![Coverage](https://img.shields.io/badge/coverage-81.7%25-brightgreen?logo=jest&logoColor=white)](https://github.com/Bozhidar-A/agro_calc)
[![Code Quality](https://img.shields.io/github/actions/workflow/status/Bozhidar-A/agro_calc/docker-publish.yaml?branch=release&label=quality&logo=eslint&logoColor=white)](https://github.com/Bozhidar-A/agro_calc/actions/workflows/docker-publish.yaml)
[![TypeScript](https://img.shields.io/github/actions/workflow/status/Bozhidar-A/agro_calc/docker-publish.yaml?branch=release&label=typescript&logo=typescript&logoColor=white)](https://github.com/Bozhidar-A/agro_calc/actions/workflows/docker-publish.yaml)

<!-- Project Status -->
[![Website Status](https://img.shields.io/website?url=https%3A//agro-calc.musaka.top&logo=netcup&logoColor=white)](https://agro-calc.musaka.top)
[![GitHub last commit](https://img.shields.io/github/last-commit/Bozhidar-A/agro_calc?logo=github)](https://github.com/Bozhidar-A/agro_calc/commits)

<!-- Tech Stack -->
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://postgresql.org)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma&logoColor=white)](https://prisma.io)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://reactjs.org)

<!-- Repository Stats -->
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/Bozhidar-A/agro_calc?logo=github)](https://github.com/Bozhidar-A/agro_calc/issues)
[![GitHub stars](https://img.shields.io/github/stars/Bozhidar-A/agro_calc?style=social)](https://github.com/Bozhidar-A/agro_calc/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Bozhidar-A/agro_calc?style=social)](https://github.com/Bozhidar-A/agro_calc/network/members)

## 🧰 Tech Stack

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS
- **Backend:** Next.js API routes  
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** Custom JWT with Arctic
- **Testing:** Jest, React Testing Library
- **Code Quality:** ESLint, Stylelint, Prettier
- **Deployment:** Docker + Kubernetes

## 📦 Quick Start

### Prerequisites
- Node.js 22
- PostgreSQL database
- Yarn 4+ (via Corepack)

### Installation

```bash
# Enable Corepack for Yarn 4
corepack enable

# Install dependencies
yarn install

# Set up environment
cp .env.sample .env
# Fill in your DATABASE_URL and other required values

# Initialize database
yarn init-db

# Start development server
yarn dev
```

Visit `http://localhost:3000`

## 🛠️ Available Scripts

### Development
- `yarn dev` - Start development server
- `yarn build` - Production build
- `yarn start` - Start production server
- `yarn analyze` - Bundle analysis

### Database  
- `yarn init-db` - Reset and initialize database
- `yarn reset-db` - Reset DB and push schema

### Code Quality
- `yarn typecheck` - TypeScript type checking
- `yarn lint` - Run ESLint and Stylelint
- `yarn eslint` - ESLint only
- `yarn stylelint` - Stylelint only
- `yarn prettier:check` - Check formatting
- `yarn prettier:write` - Fix formatting

### Testing
- `yarn jest` - Run tests
- `yarn jest:watch` - Run tests in watch mode
- `yarn test:all` - All quality checks (tests + lint + format + types)
- `yarn test-coverage` - Test coverage report

## 🔐 Environment Variables

Copy `.env.sample` to `.env` and configure:

| Variable          | Description             | Example                                           |
| ----------------- | ----------------------- | ------------------------------------------------- |
| `DATABASE_URL`    | PostgreSQL connection   | `postgresql://user:pass@localhost:5432/agro_calc` |
| `SALT_ROUNDS`     | Password hashing rounds | `10`                                              |
| `NEXTAUTH_SECRET` | JWT secret              | Generate with `openssl rand -base64 32`           |
| `NEXTAUTH_URL`    | Application URL         | `https://agro-calc.musaka.top`                    |
| `NODE_ENV`        | Environment             | `development` or `production`                     |

## 🐳 Docker

```bash
# Run with docker-compose (includes PostgreSQL)
docker compose up --build

# Or pull the built image
docker pull ghcr.io/bozhidar-a/agro_calc:latest
```

## 🚀 Deployment

The app auto-builds a new Docker image when pushing to the `release` branch:

1. Tests run automatically
2. Docker image builds and pushes to GHCR
3. Tagged with both `latest` and short commit SHA

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `yarn test:all` to ensure quality
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](./LICENSE) file.