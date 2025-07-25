# Gunakan Bun Alpine image
FROM oven/bun:1.2.18-alpine

# Set working directory
WORKDIR /usr/src/app

# Set environment (buat Puppeteer)
ENV CHROME_BIN="/usr/bin/chromium-browser" \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true" \
    NODE_ENV="production"

# Install Chromium & font
RUN set -x \
    && apk update \
    && apk upgrade \
    && apk add --no-cache \
    udev \
    ttf-freefont \
    chromium

# Copy package.json dan bun.lock
COPY package.json bun.lock ./

# Install dependencies pake Bun
RUN bun install --production

# Copy semua source code
COPY . .

# Buka port
EXPOSE 3000

# Jalanin server.js pake Bun
CMD ["bun", "server.js"]
