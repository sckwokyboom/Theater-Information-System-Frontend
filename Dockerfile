# Используем базовый образ с Node.js
FROM node:latest AS build
# Устанавливаем директорию приложения
WORKDIR /app
# Копируем package.json и package-lock.json для установки зависимостей
COPY package*.json ./
# Устанавливаем зависимости
RUN npm install
# Копируем исходный код приложения
COPY . .
# Собираем приложение
RUN npm run build
# Начинаем с нового образа без Node.js
FROM nginx:alpine
# Копируем собранные файлы из предыдущего образа в образ NGINX
COPY --from=build /app/dist /usr/share/nginx/html
# Настраиваем NGINX, если это необходимо
# COPY nginx.conf /etc/nginx/nginx.conf
# Открываем порт для NGINX
EXPOSE 80
# Запускаем NGINX в фоновом режиме при запуске контейнера
CMD ["nginx", "-g", "daemon off;"]
