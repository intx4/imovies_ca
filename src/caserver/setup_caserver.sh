#!/bin/sh
apt update
apt install nginx net-tools rsyslog-gnutls nginx-extras -y
apt install libpcre3 libpcre3-dev -y
cp caserver/nginx/nginx.conf /etc/nginx/sites-available/default
mkdir -p /etc/nginx/ssl
mkdir -p /etc/ca/intermediate
cp caserver/cert/* /etc/nginx/ssl
chmod 600 /etc/nginx/ssl/caserver.key
cp -R caserver/api/intermediate/* /etc/ca/intermediate
chown -R vagrant:www-data /etc/ca
chmod -R o-xr /etc/ca
chmod 730 /etc/ca/intermediate/
chmod 710  /etc/ca/intermediate/private
chmod 730  /etc/ca/intermediate/certificates
chmod 730  /etc/ca/intermediate/newcerts
chown vagrant /etc/ca/intermediate/new_cert.sh
chmod 600 /etc/ca/intermediate/new_cert.sh
chmod g+rx /etc/ca/intermediate/new_cert.sh
mkdir -p /var/log/flask
chown www-data:www-data /var/log/flask
apt install python3 python3-pip -y
cd caserver/api
pip3 install -r requirements.txt
systemctl link /home/vagrant/caserver/api/caserver.service
systemctl enable caserver.service
systemctl start caserver.service
systemctl restart caserver.service
systemctl restart nginx

# Rsyslog
cd "/home/vagrant"
cp ./caserver/cert/cacert.pem /etc/ssl/certs/
cp ./caserver/log/rsyslog.conf /etc/rsyslog.conf
cp caserver/log/nginx.conf /etc/rsyslog.d/nginx.log
systemctl restart rsyslog