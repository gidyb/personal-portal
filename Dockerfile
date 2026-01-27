# Start with the official PHP 8.4 FPM image
FROM php:8.4-fpm

# Set environment variables
ENV COMPOSER_MEMORY_LIMIT=-1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libsqlite3-dev \
    libicu-dev \
    zip \
    unzip \
    gnupg2

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql pdo_sqlite mbstring exif pcntl bcmath gd zip intl

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Install Node.js (needed for building assets)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Set working directory
WORKDIR /var/www

# Copy existing application directory contents
COPY . /var/www

# Install composer dependencies with high verbosity to see what is failing
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader --no-scripts -vvv

# Install npm dependencies and build assets
RUN npm install && npm run build

# Create SQLite database
RUN touch database/database.sqlite \
    && chmod -R 777 storage bootstrap/cache database

# Set up the start script
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Expose port
EXPOSE 8000

# Start the application
CMD ["/usr/local/bin/docker-entrypoint.sh"]
