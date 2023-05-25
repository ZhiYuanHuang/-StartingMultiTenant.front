FROM node:16.18 AS builder
ARG VITE_authBaseUrl="http://192.168.1.101:5251" \
    VITE_dataBaseUrl="http://192.168.1.101:5251" \
    VITE_signalRUrl="http://192.168.1.101:5251"
WORKDIR /app
COPY . .
RUN yarn install && yarn build

FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/dist .
ENTRYPOINT ["nginx","-g","daemon off;"]
