# ================================
# InverSer Frontend - Production Dockerfile
# Multi-stage build: Node build + Nginx serve
# Supports: yarn (preferred) or npm fallback
# ================================

# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Build argument for API URL (injected at build time)
ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL

# Copy package files (handle both yarn and npm)
COPY package.json ./
COPY yarn.lock* package-lock.json* ./

# Install dependencies
# Priority: yarn.lock > package-lock.json > npm install
RUN if [ -f yarn.lock ]; then \
      echo "Using Yarn..." && \
      yarn install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then \
      echo "Using npm ci..." && \
      npm ci; \
    else \
      echo "No lockfile found, using npm install..." && \
      npm install; \
    fi

# Copy source code
COPY . .

# Build the application (CRA with CRACO outputs to /build)
RUN if [ -f yarn.lock ]; then \
      yarn build; \
    else \
      npm run build; \
    fi

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
# CRA outputs to /build (not /dist like Vite)
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
