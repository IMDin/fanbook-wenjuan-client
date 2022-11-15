# 前端应用打包

详细打包流程见 .github/workflow/build-compiler-main.yml

## 1、nodejs版本
+ nodejs 1.18.0

## 2、npm版本（重要）
+ **[export NODE_OPTIONS=--openssl-legacy-provider](https://github.com/webpack/webpack/issues/14532)**
+ **npm npm@6.14.1**

# 前端应用部署

## 1、nginx版本
+ nginx version: nginx/1.18.0 (Ubuntu)

## 2、nginx配置（重要）
```text
http {
    upstream kube_ingress_controller {
        least_conn;
        server 172.16.32.7:80;
        server 172.16.32.10:80;
    }
    
    include       mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    gzip on;
    gzip_comp_level 5;
    gzip_min_length 1k;
    gzip_buffers 4 16k;
    gzip_proxied any;
    gzip_vary on;
    gzip_types
      application/javascript
      application/x-javascript
      text/javascript
      text/css
      text/xml
      application/xhtml+xml
      application/xml
      application/atom+xml
      application/rdf+xml
      application/rss+xml
      application/geo+json
      application/json
      application/ld+json
      application/manifest+json
      application/x-web-app-manifest+json
      image/svg+xml
      text/x-cross-domain-policy;
    gzip_static on;
    gzip_disable "MSIE [1-6]\.";

    client_header_buffer_size 32k;
    large_client_header_buffers 4 32k;

    server {
        listen       80;
        server_name  wenjuan.k.tarstime.com;

        location / {
            # 静态文件地址 root访问路径会把请求的路径带上
            root   /usr/share/nginx/fanbook-client;
	          try_files $uri$args $uri$args/ $uri $uri/ /index.html;
            index  index.html index.htm;

            client_max_body_size 1024m;
            client_body_timeout 600;
            send_timeout 600;
        }

        location /mofang-api/{
            proxy_set_header Host $http_host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header REMOTE-HOST $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            # proxy_pass http://tduck-app:8999/tduck-api/;
            proxy_pass http://kube_ingress_controller;

            client_max_body_size 1024m;
            client_body_timeout 600;
            send_timeout 600;
        }

        #error_page   500 502 503 504  /50x.html;
        #location = /50x.html {
        #    root   html;
        #}
    }
}
```

