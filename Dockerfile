# ---------------------------------------------------------
# STAGE 1: Build the Frontend (React/Vite)
# ---------------------------------------------------------
FROM node:18.19.0-alpine as frontend-builder

WORKDIR /app/client

# Copy only frontend package files to cache dependencies
COPY client/package*.json ./
RUN npm install

# Copy frontend source code and build
COPY client/ .
RUN npm run build

# ---------------------------------------------------------
# STAGE 2: Build Backend & Final Image
# ---------------------------------------------------------
FROM node:18.19.0-alpine

WORKDIR /app

# Copy root (backend) package files
COPY package*.json ./
RUN npm install

# Copy backend source code
COPY . .

# Copy the BUILT frontend from Stage 1 (Magic Step!)
# We place it exactly where your server expects it
COPY --from=frontend-builder /app/client/dist ./client/dist

# Build the Backend (TypeScript -> JavaScript)
RUN npm run build

# Clean up (Optional: remove source files to save space)
# RUN rm -rf client/node_modules  <-- Not needed, we never copied them in Stage 2!

EXPOSE 8000

CMD ["npm", "start"]