FROM node:20-alpine

WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN npm install --production

# Copy server source code
COPY . .

EXPOSE 5001

CMD ["node", "app.js"]
