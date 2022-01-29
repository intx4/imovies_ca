#!/bin/sh
cp ./firewall/cert/cacert.pem /etc/ssl/certs/
sudo apt update
sudo apt install net-tools rsyslog-gnutls -y
sudo sed -i -r "s/^#(net.ipv4.ip_forward=1)/\1/" /etc/sysctl.conf
sudo sysctl -p
sudo apt install -y iptables
sudo iptables -F
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT DROP
iptables -A INPUT -p tcp -m tcp --dport 22 -j ACCEPT
iptables -A INPUT -m state --state RELATED,ESTABLISHED -j ACCEPT
iptables -A FORWARD -s 172.26.0.2/32 -d 172.27.0.2/32 -p tcp -m tcp --dport 443 -j ACCEPT
iptables -A FORWARD -m state --state RELATED,ESTABLISHED -j ACCEPT
iptables -A OUTPUT -m state --state RELATED,ESTABLISHED -j ACCEPT
iptables -A OUTPUT -d 172.27.0.4/32 -p tcp -m tcp --dport 6514 -j ACCEPT
iptables -A FORWARD -d 172.27.0.0/24 -p tcp -m tcp --dport 22 -j ACCEPT
iptables -A FORWARD -s 172.26.0.2/32 -p tcp -m tcp --dport 6514 -j ACCEPT


# Rsyslog
cp ./firewall/rsyslog.conf /etc/rsyslog.conf
systemctl restart rsyslog
