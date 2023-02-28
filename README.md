<h1 align="center">StartingMultiTenant.Front</h1>

<div align="center">

The front project of [StartingMultiTenant](https://github.com/ZhiYuanHuang/StartingMultiTenant)

</div>

English | [简体中文](./README-zh_CN.md) 

## 📦 Install

### build run

1. modify Enviroment var VITE_authBaseUrl，VITE_dataBaseUrl (.env) to be the url of startingmultitenant 

2. install dependence

   execute
   ```
   yarn install
   ```

3. debug

    after executed，visit localhost:5173 and login the admin acccount
    ```
    yarn dev
    ```

4. build

   ```
   yarn build
   ```

### Docker run

1. modify DockerFile ARG as startingmultitenant real address

```
ARG VITE_authBaseUrl="http://192.168.1.101:5251" \
    VITE_dataBaseUrl="http://192.168.1.101:5251"
```

2. build image
```
docker build -t zionyellow/startingmultitenant.front .
```

3. docker run

```
docker run -p 3000:80 --restart=always -d zionyellow/startingmultitenant.front
```