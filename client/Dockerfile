# Multi-stage build for React frontend
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

# Install serve to host the built app
RUN npm install -g serve

# Copy built assets from build stage
COPY --from=build /app/build /app

# Expose port 9001
EXPOSE 9001

# Start the application on port 9001
CMD ["serve", "-s", "/app", "-l", "9001"]
