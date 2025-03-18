# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Expose port 5173 (default Vite port)
EXPOSE 5173

# Start the development server
CMD ["npm", "run", "dev"]