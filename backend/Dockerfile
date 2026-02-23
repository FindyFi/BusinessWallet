# Stage 1: Build TypeScript and native modules
FROM node:20-alpine AS builder

WORKDIR /app

# Build tools needed to compile Askar native bindings as a fallback
# if prebuilt binaries are unavailable for the current platform.
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src/ ./src/

RUN npm run build

# Stage 2: Lean production image
# node_modules (including compiled native binaries) are copied from the builder
# stage so build tools are not present in the final image.
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
# Copy the full node_modules from the builder stage (includes compiled Askar binaries)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/index.js"]
