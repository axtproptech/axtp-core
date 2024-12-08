
# prepare repo
FROM node:18-alpine AS builder

WORKDIR /app

RUN yarn global add turbo@2 
COPY . .
RUN turbo prune @axtp/backend --docker

# Install deps
# FROM oven/bun:latest AS installer
FROM node:18-slim AS installer

# Install required tools
RUN apt-get update && apt-get install -y curl bash unzip
# Install Bun
RUN curl -fsSL https://bun.sh/install | bash -s

# Add Bun to PATH
ENV BUN_INSTALL="/root/.bun"
ENV PATH="${BUN_INSTALL}/bin:${PATH}"

# Verify installation
RUN bun --version

# Debug to check if Bun is installed
RUN echo $PATH && which bun && ls -l /root/.bun/bin && bun --version

# Verify installation
RUN bun --version

WORKDIR /app
ENV HUSKY=0

COPY --from=builder /app/out/json/ .
RUN bun install 

# Build the project
COPY --from=builder /app/out/full/ .
RUN bun run build:backend

FROM oven/bun:1 AS runner

WORKDIR /app

COPY --from=installer /app/ .

WORKDIR /app/apps/backend

EXPOSE 3000

CMD ["bun", "run", "src/index.ts"] 