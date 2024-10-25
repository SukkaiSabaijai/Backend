# Stage 1: Build
FROM node:18 AS builder

# Set the working directory
WORKDIR /usr/src/app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy the application source code
COPY . .

# Build the NestJS application
RUN pnpm run build

# Stage 2: Production
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy only the build artifacts and necessary files from the builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/pnpm-lock.yaml ./

# Install only production dependencies
RUN npm install -g pnpm && pnpm install --prod

# Expose the application port
EXPOSE 3000

# Start the NestJS application
CMD ["pnpm", "run", "start:prod"]
