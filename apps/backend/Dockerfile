# Use the official Bun image
FROM oven/bun:latest
# Disable Husky
ENV HUSKY=0
# Install Yarn for turbo

RUN apt-get update && apt-get install -y yarn
# Set working directory
WORKDIR /app

COPY ./package.json ./bun.lockb ./yarn.lock ./turbo.json ./
COPY ./packages ./packages
COPY ./ ./

# Install dependencies
# RUN yarn

# Build all dependencies using turbo
# RUN bunx turbo run build --filter={apps/backend}... --force
# RUN bun build:backend

# Set working directory to backend
# WORKDIR /app/backend

# # Expose the port your app runs on
# EXPOSE 3000

# # Start the application
# CMD ["bun", "run", "src/index.ts"] 