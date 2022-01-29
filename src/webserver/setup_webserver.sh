#!/bin/sh
apt-get install net-tools nginx rsyslog-gnutls nginx-extras -y
cp webserver/nginx/nginx.conf /etc/nginx/sites-available/default
mkdir -p /etc/nginx/ssl
cp webserver/cert/* /etc/nginx/ssl
chmod 600 /etc/nginx/ssl/web.key
cp -r webserver/frontend/build/* /var/www/html/
cat <<EOF > /etc/hosts
172.27.0.2 caserver.imovies
127.0.0.1       localhost
127.0.1.1       ubuntu2004.localdomain

# The following lines are desirable for IPv6 capable hosts
::1     localhost ip6-localhost ip6-loopback
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters

127.0.0.1 ubuntu2004.localdomain
EOF
systemctl restart nginx

# firewall
apt install -y iptables
iptables -F
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT DROP
iptables -A INPUT -m state --state RELATED,ESTABLISHED -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 22 -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 443 -j ACCEPT
iptables -A OUTPUT -m state --state RELATED,ESTABLISHED -j ACCEPT
iptables -A OUTPUT -d 172.27.0.2/32 -p tcp -m tcp --dport 443 -j ACCEPT
iptables -A OUTPUT -d 172.27.0.4/32 -p tcp -m tcp --dport 6514 -j ACCEPT



#sudo iptables -A INPUT -p icmp --icmp-type echo-request -j DROP

# rsyslog
cp ./webserver/cert/cacert.pem /etc/ssl/certs/
cp ./webserver/log/rsyslog.conf /etc/rsyslog.conf
cp webserver/log/nginx.conf /etc/rsyslog.d/nginx.log
systemctl restart rsyslog
