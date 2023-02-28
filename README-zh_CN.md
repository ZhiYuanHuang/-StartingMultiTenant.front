<h1 align="center">StartingMultiTenant.Front</h1>

<div align="center">

[StartingMultiTenant](https://github.com/ZhiYuanHuang/StartingMultiTenant)的前端项目

</div>

[English](./README.md) | 简体中文 

## 📦 运行

### 编译运行

1. 修改环境变量 VITE_authBaseUrl，VITE_dataBaseUrl (.env)为 startingmultitenant 项目的ip和端口

2. 安装依赖

   项目根目录下执行
   ```
   yarn install
   ```

3. 测试运行

    项目根目录下执行后，访问localhost:5173，登录管理员账号
    ```
    yarn dev
    ```

4. build

   ```
   yarn build
   ```

### Docker运行

1. 修改DockerFile ARG 为实际staringmultitenant项目的地址

```
ARG VITE_authBaseUrl="http://192.168.1.101:5251" \
    VITE_dataBaseUrl="http://192.168.1.101:5251"
```

2. 编译镜像
```
docker build -t zionyellow/startingmultitenant.front .
```

3. docker 运行

```
docker run -p 3000:80 --restart=always -d zionyellow/startingmultitenant.front
```