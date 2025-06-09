#https://medium.com/@FandaSidak/dockerfile-with-next-js-app-using-yarn-4-fc553152a356
#Dockerfile that works for nextjs and yarn
#very heavily modified from the original

FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS builder

# Accept build arguments
ARG RESEND_API_KEY
ARG NEXT_PUBLIC_HOST_URL

# Set environment variables for build
ENV NEXT_PUBLIC_HOST_URL=$NEXT_PUBLIC_HOST_URL

# Install necessary packages
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN corepack enable

WORKDIR /app

# Copy package.json and yarn lock files
COPY package.json yarn.lock* ./

# Create .yarnrc.yml file to ensure node-modules linking strategy
RUN echo 'nodeLinker: "node-modules"' > .yarnrc.yml

# Install dependencies
RUN yarn install --immutable

# Copy the rest of the application
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Build the application
RUN yarn build

# Production image, copy all the files and run next
FROM base AS runner

WORKDIR /app

ENV NODE_ENV production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public directory
COPY --from=builder /app/public ./public

# Copy build output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Delete cache
RUN rm -rf .next/cache

# Copy Prisma files
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Switch to non-root user
USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Run migrations and start the server
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]