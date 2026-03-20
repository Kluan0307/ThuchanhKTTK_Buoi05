FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Chạy file app.js
CMD ["node", "app.js"]