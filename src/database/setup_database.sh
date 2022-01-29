#!/bin/bash
DBPASSWD=FiE5HF4xHOsPIL9n

debconf-set-selections <<< "mysql-server mysql-server/root_password password $DBPASSWD"
debconf-set-selections <<< "mysql-server mysql-server/root_password_again password $DBPASSWD"

sudo apt update
sudo apt install mysql-server net-tools -y

mysql -u root -p$DBPASSWD -e "CREATE DATABASE imovies"
mysql -u root -p$DBPASSWD imovies < imovies_users.sql
mysql -u root -p$DBPASSWD imovies < initdatabase.sql

cp my.cnf /etc/mysql/conf.d
mkdir /etc/mysql/ssl
cp ./cert/cacert.pem /etc/mysql/ssl/cacert.pem
cp ./cert/db.pem /etc/mysql/ssl/db-cert.pem
cp ./cert/db.key /etc/mysql/ssl/db-key.pem
sudo chown mysql /etc/mysql/ssl/db-cert.pem
sudo chown mysql /etc/mysql/ssl/db-key.pem
sudo chmod 644 /etc/mysql/ssl/cacert.pem
sudo chmod 644 /etc/mysql/ssl/db-cert.pem
sudo chmod 600 /etc/mysql/ssl/db-key.pem
sudo sed -i -e "s/127.0.0.1/172.27.0.3/g" /etc/mysql/mysql.conf.d/mysqld.cnf
sudo sed -i -r 's/^#( general_log)/\1/' /etc/mysql/mysql.conf.d/mysqld.cnf
sudo systemctl restart mysql

# setup backup
apt install sshpass
export SSHPASS=bC8LcLh2WuHtJKE7r4D2
sshpass -e sftp -oStrictHostKeyChecking=no -oBatchMode=no -b - dbackup@172.27.0.4 << !
quit
!
touch mysql_backup.sh
cat << 'EOL' > mysql_backup.sh
#!/bin/bash

curr_date=`date +"%Y-%m-%d"`

mysqldump -u dbackup --password=HpDMDF2dQexqGZQcag8D imovies > imovies_bkp_$curr_date.sql

export SSHPASS=bC8LcLh2WuHtJKE7r4D2
sshpass -e sftp -oBatchMode=no -b - dbackup@172.27.0.4 << !
put imovies_bkp_$curr_date.sql
quit
!

rm imovies_bkp_$curr_date.sql
EOL
chown vagrant:vagrant mysql_backup.sh
chmod u+x mysql_backup.sh

echo "0 9 * * * /home/vagrant/mysql_backup.sh" > cron_tmp
crontab -u vagrant cron_tmp
rm cron_tmp

# rsyslog
apt install rsyslog-gnutls -y
cp cert/cacert.pem /etc/ssl/certs/
cp rsyslog.conf /etc/rsyslog.conf
systemctl restart rsyslog

rm *
