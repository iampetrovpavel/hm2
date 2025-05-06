FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install

# Copy all files
COPY . .

# Expose the development server port
EXPOSE 5173

# Run the development server
CMD ["pnpm", "run", "dev", "--host", "0.0.0.0"]