#!/bin/bash
cat <<EOF > /etc/netplan/50-vagrant.yaml
---
network:
  version: 2
  renderer: networkd
  ethernets:
    eth1:
      addresses:
        - 172.27.0.3/24
      routes:
        - to: 172.26.0.0/24
          via: 172.27.0.254
EOF
netplan apply