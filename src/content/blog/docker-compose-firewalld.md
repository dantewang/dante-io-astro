---
title: "Docker Compose网络问题一则"
date: 2025-12-17T00:17:39+08:00
tags: ["docker", "linux"]
memo: memos/X3yZkKzLxe2XnpG779xb8W
---
之前尝试在服务器上使用Docker Compose来部署Ghost，使用从官方抄来的compose.yml，Ghost却无法启动，提示无法连接到MySQL数据库。把compose文件和问题描述给GPT4o，按照其给出的提示一步步排查，也没有效果。

后来发现，这个问题实际上与防火墙有关。服务器使用的是Fedora Server+firewalld，要让在同一个Docker内部网络里的一个容器能访问另一个容器的端口（如MySQL的3306），需要在firewalld中配置：

```bash
sudo firewall-cmd --zone=docker --permanent --add-port=3306/tcp
sudo firewall-cmd --reload
```

设置完后，无论是Ghost还是Wordpress都可以正常连接到数据库了。
