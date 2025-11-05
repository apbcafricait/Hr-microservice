# Build stage
FROM node:18-alpine

WORKDIR /app

# Install pnpm first
RUN npm install -g pnpm

# Copy package files
COPY package*.json ./

# Copy source code (excluding node_modules via .dockerignore)
COPY . .

# Install dependencies
RUN pnpm install

# Build the application
RUN pnpm run build

# Expose port 9001
EXPOSE 9001

# Use vite preview to serve the built application
CMD ["pnpm", "run", "preview", "--host", "0.0.0.0", "--port", "9001"]