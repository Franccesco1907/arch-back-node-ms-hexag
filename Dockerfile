FROM node:24-alpine

WORKDIR /app

# Copiar package files primero para aprovechar cache
COPY package.json package-lock.json ./
RUN npm ci

# Copiar fuentes y compilar
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

EXPOSE 5010

CMD ["npm", "start"]