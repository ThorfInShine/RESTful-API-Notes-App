# Multi-stage build untuk optimasi ukuran image

# Stage 1: Build Stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (termasuk devDependencies untuk build)
RUN npm ci

# Copy webpack config files
COPY webpack.*.js ./

# Copy source code
COPY index.html ./
COPY css ./css/
COPY js ./js/

# Build aplikasi
RUN npm run build

# Stage 2: Production Stage
FROM nginx:alpine

# Install curl untuk healthcheck
RUN apk add --no-cache curl

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf

# Copy built files dari build stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]