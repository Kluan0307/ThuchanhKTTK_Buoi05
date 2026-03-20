FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Chạy ở chế độ dev để làm bài tập cho nhanh
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]