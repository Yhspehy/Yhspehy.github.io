---
layout: post
title: shadowsocks
tag: VPN
keywords: shadowsocks
---


## 安装

### 连接服务器

```js
ssh root@ip
```

### 安装pip

curl <https://bootstrap.pypa.io/get-pip.py> -o get-pip.py

执行： python get-pip.py

### 安装shadowsocks

pip install shadowsocks

### 配置shadowsocks

vi /etc/shadowsocks.json

```js

{
    "server":"0.0.0.0",     // 填写你的服务器地址
    "server_port":50013,    // 服务器暴露的断开
    "local_port":1080,
    "password":"1234567890", // 暴露的端口密码
    "timeout":600,
    "method":"aes-256-cfb"
}
```

### 将shadowsocks加入系统服务

vi /etc/systemd/system/shadowsocks.service

```js
[Unit]
Description=Shadowsocks
[Service]
TimeoutStartSec=0
ExecStart=/usr/bin/ssserver -c /etc/shadowsocks.json
[Install]
WantedBy=multi-user.target
```

### 启动shadowsocks服务并设置开机自启

```js
# 设置开机自启命令
systemctl enable shadowsocks

# 启动命令
systemctl start shadowsocks

#查看状态命令
systemctl status shadowsocks
```

### CentOs7 需要开放端口或者直接关闭防火墙

1.启动防火墙

```js
systemctl start firewalld
```

2.关闭防火墙

```js
systemctl stop firewalld
```

3.重启防火墙

```js
firewall-cmd --reload
```

4.查看防火墙状态

```js
systemctl status firewalld
```

5.在指定区域打开端口

```js
firewall-cmd --zone=public --add-port=80/tcp(永久生效再加上 --permanent)
```

6.查看指定区域所有打开的端口

```js
firewall-cmd --zone=public --list-ports
```
