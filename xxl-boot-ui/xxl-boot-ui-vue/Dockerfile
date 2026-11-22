# base image
# build stage：前端构建
FROM node:22-slim AS build

# work dir
WORKDIR /app

# install deps
COPY package.json ./
RUN npm install

# copy source & build
COPY . .
RUN npm run build

# runtime stage：Nginx 静态服务
FROM nginx:alpine

# copy build output
COPY --from=build /app/dist /usr/share/nginx/html

# nginx config（来自 additional_contexts: docker/modular）
COPY --from=nginx /nginx.conf /etc/nginx/conf.d/default.conf

# expose port
EXPOSE 80
