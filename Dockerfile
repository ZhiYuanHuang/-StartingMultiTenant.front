FROM node:16.18
ARG VITE_authBaseUrl="http://172.30.192.81:5251" \
    VITE_dataBaseUrl="http://172.30.192.81:5251"
WORKDIR /project/
COPY package.json package-lock.json /project/
RUN yarn install
COPY . /project/
RUN yarn build
CMD yarn start:prod
