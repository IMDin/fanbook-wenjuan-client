## 前端源码

npm i -g mirror-config-china --registry=https://registry.npm.taobao.org

# 安装依赖
npm install

# 启动服务 localhost:8013
npm run serve

# 构建生产环境
npm run build
```


#### 常见问题

1、linux 系统在安装依赖的时候会出现 node-sass 无法安装的问题

解决方案：
```
1. 单独安装：npm install --unsafe-perm node-sass 
2. 直接使用：npm install --unsafe-perm
```


####  目录简介
- api axios 封装
- assets 静态资源
- components 公共组件
- router 路由
- store vuex
- theme elementui主题
- util 工具类
- views 页面



