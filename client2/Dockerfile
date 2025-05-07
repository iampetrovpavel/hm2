FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy all files
COPY . .

# Expose the development server port
EXPOSE 5173

# Run the development server
CMD ["npm", "run", "dev", "--host", "0.0.0.0"]