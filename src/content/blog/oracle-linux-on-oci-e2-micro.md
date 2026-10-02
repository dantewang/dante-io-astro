---
title: "在Oracle Cloud E2.1 Micro VM上使用Oracle Linux"
date: 2025-12-17T00:15:18+08:00
tags: ["linux"]
memo: memos/Yzbvar4qRuwGDs5o3ghrUm
---
Oracle Cloud的免费账户可以免费使用带1个AMD vCPU和1G内存的E2.1 Micro VM。由于硬件资源有限，在使用Oracle Linux的时候，需要进行一些额外配置。

## 修复`dnf`无法运行的问题

运行`dnf`命令的时候，会长时间没有反应，然后显示“dnf killed”，这是内存不足导致的，可以设置SWAP文件来解决。

```bash
$ sudo dd if=/dev/zero of=/.swapfile1 bs=1024 count=2093152
$ sudo chown root:root /.swapfile1
$ sudo chmod 0600 /.swapfile1
$ sudo mkswap /.swapfile1
$ sudo swapon /.swapfile1
$ sudo vi /etc/fstab # 添加一行 /.swapfile1 none swap sw 0 0
$ sudo reboot
$ free -h # confirm the swap space
```

参考：[\[Fixed?\] Tiny, But Heroic Oracle Free Tier VPS Runs Out Of Memory During DNF Upgrade!](https://lowendspirit.com/discussion/5922/fixed-tiny-but-heroic-oracle-free-tier-vps-runs-out-of-memory-during-dnf-upgrade)

## 关掉`kdump`

实际上1G内存应该可以满足`dnf`的需要，但是系统默认开启了`kdump`，导致可用内存不足。

通过以下命令关掉`kdump`：

```bash
$ sudo systemctl disable --now kdump.service
$ sudo systemctl mask --now kdump.service
$ cat /proc/cmdline
BOOT_IMAGE=(hd0,gpt2)/vmlinuz-5.15.0-206.153.7.1.el9uek.x86_64 root=/dev/mapper/ocivolume-root ro crashkernel=1G-64G:448M,64G-:512M LANG=en_US.UTF-8 console=tty0 console=ttyS0,115200 rd.lvm.vg=ocivolume rd.lvm.lv=ocivolume/root rd.neednet rd.net.timeout.dhcp=5 rd.net.timeout.carrier=5 net.ifnames=1 nvme_core.shutdown_timeout=10 quiet loglevel=0 systemd.show_status=auto rd.udev.log_level=3 selinux=0

$ sudo grubby --update-kernel=ALL --remove-args="crashkernel=1G-64G:448M,64G-:512M"
$ sudo reboot
```
