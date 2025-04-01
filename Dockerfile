# Build frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY app/frontend/package*.json ./
RUN npm install
COPY app/frontend/ .
RUN npm run build

# Build backend
FROM golang:1.21-alpine AS backend-builder
WORKDIR /app/backend
COPY app/backend/go.mod ./
RUN go mod download
COPY app/backend/ .
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# Final stage
FROM alpine:latest

# Install nginx and supervisor
RUN apk add --no-cache nginx supervisor

# Copy frontend build
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html/static

# Copy backend binary
COPY --from=backend-builder /app/backend/main /app/main

# Copy configurations
COPY devops/nginx.conf /etc/nginx/nginx.conf
COPY devops/supervisord.conf /etc/supervisord.conf

# Create log directory
RUN mkdir -p /var/log/supervisor

# Expose port 80
EXPOSE 80

# Set environment variable for Go app
ENV GIN_MODE=release

# Run supervisord
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"] 