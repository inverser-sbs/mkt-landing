# ================================
# InverSer Frontend - Production Dockerfile
# Multi-stage build: Node build + Nginx serve
# ================================

# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Build argument for API URL (injected at build time)
ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build the application (CRA with CRACO outputs to /build)
RUN yarn build

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
