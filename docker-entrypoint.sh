#!/bin/sh

# Run migrations
php artisan migrate --force

# Cache settings for performance
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Start the built-in PHP server
php artisan serve --host=0.0.0.0 --port=$PORT
