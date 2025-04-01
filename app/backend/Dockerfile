FROM golang:1.21-alpine AS builder

WORKDIR /app

# Copy go mod and sum files
COPY go.mod ./

# Download dependencies
RUN go mod download

# Copy the source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# Final stage
FROM alpine:latest

# Install nginx and supervisor
RUN apk add --no-cache nginx supervisor

WORKDIR /app

# Copy the binary from builder
COPY --from=builder /app/main .

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create directory for static files
RUN mkdir -p /usr/share/nginx/html/static

# Create supervisor configuration and directories
RUN mkdir -p /var/log/supervisor && \
    echo '[supervisord]' > /etc/supervisord.conf && \
    echo 'nodaemon=true' >> /etc/supervisord.conf && \
    echo 'logfile=/var/log/supervisord.log' >> /etc/supervisord.conf && \
    echo 'pidfile=/var/run/supervisord.pid' >> /etc/supervisord.conf && \
    echo '[rpcinterface:supervisor]' >> /etc/supervisord.conf && \
    echo 'supervisor.rpcinterface_factory = supervisor.rpcinterface:make_main_rpcinterface' >> /etc/supervisord.conf && \
    echo '[supervisorctl]' >> /etc/supervisord.conf && \
    echo 'serverurl=http://127.0.0.1:9001' >> /etc/supervisord.conf && \
    echo '[inet_http_server]' >> /etc/supervisord.conf && \
    echo 'port=127.0.0.1:9001' >> /etc/supervisord.conf && \
    echo '[program:goapp]' >> /etc/supervisord.conf && \
    echo 'command=/app/main' >> /etc/supervisord.conf && \
    echo 'stdout_logfile=/var/log/supervisor/goapp-stdout.log' >> /etc/supervisord.conf && \
    echo 'stderr_logfile=/var/log/supervisor/goapp-stderr.log' >> /etc/supervisord.conf && \
    echo '[program:nginx]' >> /etc/supervisord.conf && \
    echo 'command=nginx -g "daemon off;"' >> /etc/supervisord.conf && \
    echo 'stdout_logfile=/var/log/supervisor/nginx-stdout.log' >> /etc/supervisord.conf && \
    echo 'stderr_logfile=/var/log/supervisor/nginx-stderr.log' >> /etc/supervisord.conf

# Expose port 80
EXPOSE 80

# Set environment variable for Go app
ENV GIN_MODE=release

# Run supervisord
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
