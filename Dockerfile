FROM node:20-alpine AS build

WORKDIR /app

ARG VITE_GA_MEASUREMENT_ID
ENV VITE_GA_MEASUREMENT_ID=$VITE_GA_MEASUREMENT_ID

COPY package*.json ./
RUN npm install --no-audit --no-fund

COPY . .
RUN npm run build

FROM nginx:1.27-alpine

ENV PORT=8080

COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY docker/nginx/start-nginx.sh /usr/local/bin/start-nginx.sh
COPY --from=build /app/dist /usr/share/nginx/html

RUN chmod +x /usr/local/bin/start-nginx.sh

EXPOSE 8080

ENTRYPOINT ["/usr/local/bin/start-nginx.sh"]
