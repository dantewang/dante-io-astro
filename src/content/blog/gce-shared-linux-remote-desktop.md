---
title: "在GCE的VM上配置可共享的Linux远程桌面"
date: 2025-12-17T00:18:21+08:00
updated: 2025-12-20T02:46:31+08:00
tags: ["linux", "xfce"]
memo: memos/3NSoUAsgMswuHtD5vottxE
---
由于工作方面的需求，需要在Google Cloud Compute Engine的VM上安装Linux桌面，并配置远程桌面。

## 安装Xfce

VM使用Ubuntu LTS 22.04 Minimal，先安装Xfce桌面。

```bash
sudo apt update
sudo apt install xbunutu-core^
sudo apt remove -y xfce4-screensaver
```

## 安装Xvfb

正常来说，在本地机器上安装完后，配置一下Lightdm，重启机器，就可以进入桌面了。但是GCE的VM似乎没有Ubuntu 22.04可用的显示设备，所以Lightdm/Xfce无法正常启动。

安装Xvfb可以解决这个问题，使得Xfce可以正常启动。

```bash
sudo apt install xvfb
Xvfb :0 -screen 0 1680x1050x24 &
export DISPLAY=:0
startxfce4 &
```

## 安装x11vnc

其实有很多其它方法来配置远程桌面，但是它们无法满足“多人登录同一个桌面”的需求。Google Chrome Remote Desktop同时只能授权一个使用者；RDP似乎每个登录的用户都会有自己的桌面session。所以选择x11vnc来作为远程桌面服务器。

```bash
sudo apt install x11vnc
x11vnc -display :0 -forever -passwd password -shared # other options
```

## 彩蛋

<details>
<summary>GPT4o的回答给出了用systemd来自启动这套远程桌面的全过程</summary>

> 在GCE虚拟机上，由于没有直接的显示设备，启动桌面环境确实会遇到一些问题。我们可以使用虚拟帧缓冲设备（如Xvfb）来解决这个问题。以下是详细的步骤来配置Xfce桌面环境和x11vnc，并使用Xvfb作为虚拟显示设备：
> 
> ##### 1\. 安装必要的软件包
> 
> 首先，确保您已经安装了Xfce桌面环境、Xvfb和x11vnc：
> 
> ```bash
> sudo apt update
> sudo apt install xfce4 xfce4-goodies xorg dbus-x11 x11-xserver-utils lightdm x11vnc xvfb
> ```
> 
> ##### 2\. 配置Xvfb和x11vnc
> 
> 您需要创建一个启动脚本来配置和启动Xvfb和x11vnc。
> 
> ###### 创建启动脚本
> 
> 创建一个新的脚本文件，例如 `/usr/local/bin/start-xfce-vnc.sh`：
> 
> ```bash
> sudo nano /usr/local/bin/start-xfce-vnc.sh
> ```
> 
> 在文件中添加以下内容：
> 
> ```bash
> #!/bin/bash
> 
> # Start Xvfb
> /usr/bin/Xvfb :0 -screen 0 1024x768x24 &
> 
> # Export DISPLAY variable
> export DISPLAY=:0
> 
> # Start xfce4-session
> startxfce4 &
> 
> # Start x11vnc
> /usr/bin/x11vnc -display :0 -forever -auth guess -passwd your_vnc_password
> ```
> 
> 将your\_vnc\_password替换为您希望使用的VNC密码。
> 
> ###### 修改脚本权限
> 
> 确保脚本是可执行的：
> 
> ```bash
> sudo chmod +x /usr/local/bin/start-xfce-vnc.sh
> ```
> 
> ##### 3\. 创建Systemd服务
> 
> 为了确保脚本在启动时运行，我们可以创建一个Systemd服务。
> 
> ###### 创建服务文件
> 
> 创建一个新的Systemd服务文件，例如/etc/systemd/system/xfce-vnc.service：
> 
> ```bash
> sudo nano /etc/systemd/system/xfce-vnc.service
> ```
> 
> 在文件中添加以下内容：
> 
> ```
> [Unit]
> Description=Start Xfce4 and x11vnc via Xvfb
> After=network.target
> 
> [Service]
> Type=simple
> ExecStart=/usr/local/bin/start-xfce-vnc.sh
> Restart=on-failure
> User=your_username
> Environment=DISPLAY=:0
> 
> [Install]
> WantedBy=multi-user.target
> ```
> 
> 将your\_username替换为您的用户名。
> 
> ##### 4\. 启用并启动服务
> 
> 启用并启动新的服务：
> 
> ```bash
> sudo systemctl daemon-reload
> sudo systemctl enable xfce-vnc.service
> sudo systemctl start xfce-vnc.service
> ```
> 
> ##### 5\. 检查服务状态
> 
> 您可以检查服务状态以确保其正确启动：
> 
> ```bash
> sudo systemctl status xfce-vnc.service
> ```
> 
> ##### 6\. 连接到Xfce桌面
> 
> 等待虚拟机完成启动后，您应该能够通过VNC客户端使用your\_vnc\_password连接到Xfce桌面环境。
> 
> 通过这些步骤，您可以在没有物理显示设备的GCE虚拟机上配置和使用Xfce桌面环境。Xvfb提供了一个虚拟帧缓冲设备，使得Xfce可以正常启动并通过x11vnc进行远程访问。

</details>
