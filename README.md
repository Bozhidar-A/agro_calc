# Agro Calc

A modern web application for agricultural calculations, built with Next.js, TypeScript, and Tailwind CSS.

**Live on VPS with k8s @** [https://agro-calc.musaka.top](https://agro-calc.musaka.top)

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

The app auto-deploys to builds a new Docker image when pushing to the `release` branch:

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