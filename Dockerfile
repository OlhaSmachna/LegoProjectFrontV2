FROM node:18-bookworm-slim AS builder
EXPOSE 4200
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install -g @angular/cli@18.2.11
RUN npm ci --force
COPY . .
CMD ["ng", "serve", "--host=0.0.0.0"]
