FROM nginx:alpine

# Copy our custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create directory for static files
RUN mkdir -p /usr/share/nginx/html/static/media

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html 