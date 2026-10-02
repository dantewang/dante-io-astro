---
title: "2024年的重装Windows系统小记"
date: 2025-12-17T00:19:03+08:00
updated: 2025-12-17T00:21:34+08:00
tags: ["windows"]
memo: memos/XUtabPpznNo7gCGaFVMHSU
---
国庆假期期间，微软发布了Windows 11 24H2的正式版系统镜像。我的台式机自从2020年组装完成之后就没有重装过系统，经过一番思想斗争，决定趁此机会来重装一遍。

## 版本选择

我放弃了微软账号里有正版许可证的Windows 11 Pro，而选择使用Windows 11 IoT Enterprise（非LTSC），原因如下：

1. IoT Enterprise和Enterprise一样，是Windows 11功能最全的版本；日常使用体验与Pro版并无差别，但是不会像Pro那样被自动推广一些App。

3. 从24H2开始，新安装的系统会自动“半开启”Bitlocker，而IoT Enterprise和IoT Enterprise LTSC不会。

5. 相比Enterprise，IoT Enterprise可以用数字许可证永久激活。

## 下载和准备

IoT Enterprise的镜像正常情况下只有特定付费用户（如MSDN订阅）可以从微软官方下载；但是有第三方网站的分流，比如

- [https://next.itellyou.cn/](https://next.itellyou.cn/)

- [https://massgrave.dev/windows\_11\_links](https://massgrave.dev/windows_11_links)

为了验证第三方ISO是否未经篡改，可以用微软账号登录

- mvs: [https://my.visualstudio.com/downloads](https://my.visualstudio.com/downloads)

登录之后，在左侧栏选择“所有下载”（All Downloads），找到Windows 11 IoT Enterprise, version 24H2，点击该行最右侧的(i)图标，就可以看到镜像的文件名和SHA256值：

```
SHA256: ECEB8DC167077E07F9A9BD04E472EA542944974B81B2EBC25477772A71BDBB69
文件名: en-us_windows_11_iot_enterprise_version_24h2_x64_dvd_3a99b72b.iso
```

下载后，打开Powershell，执行

```
Get-FileHash en-us_windows_11_iot_enterprise_version_24h2_x64_dvd_3a99b72b.iso -Algorithm SHA256
```

来计算镜像文件的SHA 256并与mvs的比较。

人们常用U盘制作工具（如Rufus）或者多镜像启动工具（Ventoy）来制作启动U盘，但是有一个更简单的办法：将U盘格式化为NTFS格式，在Windows中右键挂载ISO文件，将虚拟光驱中的所有文件复制到U盘上（也可以用解压缩工具），然后用这个U盘启动即可进入Windows 11安装程序。这个方法可能需要较新的主板支持，至少我在2020年购买的微星B550主板是可以的。

## 安装和设置

安装的时候，不需要输入任何CDKEY，选择IoT Enterprise即可。

第一次启动的设置向导只允许登录学校或企业的账号，但是可以创建本地用户账号。可以先创建本地账号，登录系统之后再到设置里去切换到自己的微软账号。

激活则可以参考这里的教程：[https://massgrave.dev/hwid](https://massgrave.dev/hwid)  
用这种方法激活可以将激活信息关联到微软账号里，方便以后重装系统。

另外，IoT版本的官方镜像只有英文版，可以在安装完成之后安装中文语言包。

### 关闭Recall功能

1. 以管理员身份运行命令提示符，执行`Dism /Online /Get-Featureinfo /Featurename:Recall`，显示 Recall 的当前状态是“已启用”；

3. 再执行`Dism /Online /Disable-Feature /Featurename:Recall`，等待进度条达到100%，操作成功完成；

5. 再次输入 1 中的命令并回车，状态变为“已禁用”。

## 其他

我习惯另行安装一个Windows虚拟机用来运行一些比较恶心的国产应用，比如百度网盘客户端。由于我选择开启“Windows安全中心”-“设备安全性“-”内核隔离“中的”内存完整性“功能，VMWare Workstation会无法使用CPU的虚拟化支持，而VirtualBox虽然能在选项里开启，性能却仍然很差。事实证明，Hyper-V完全不受这个影响，所以我在Hyper-V里安装了一个24H2 IoT Enterprise LTSC，激活方法同上。
