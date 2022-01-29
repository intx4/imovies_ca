# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.

$script = <<-SCRIPT
sed -i 's/PermitRootLogin yes/PermitRootLogin no/g' /etc/ssh/sshd_config
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/g' /etc/ssh/sshd_config
systemctl restart sshd
SCRIPT

OS = "generic/ubuntu2004"
Vagrant.configure("2") do |config|
  config.vm.provider "virtualbox" do |v|
    v.memory = 512
    v.cpus = 1
  end
  config.vm.provision "shell", inline: $script

  config.vm.define "backupserver" do |bk|
    bk.vm.box = OS
    #bk.vm.provision "file", source: "./backupserver/cert", destination: "backupserver/cert"
    bk.vm.provision "file", source: "./backupserver/encrypt_keys", destination: "backupserver/encrypt_keys"
    bk.vm.provision "file", source: "./backupserver/backup_client_privekey.sh", destination: "backup_client_privekey.sh"
    bk.vm.provision "file", source: "./backupserver/mv_db_backup.sh", destination: "mv_db_backup.sh"
    bk.vm.provision "file", source: "./backupserver/rsyslog.conf", destination: "backupserver/rsyslog.conf"
    bk.vm.provision "shell", path: "./backupserver/setup_backupserver.sh"
    bk.vm.network "private_network", ip: "172.27.0.4", virtualbox__intnet: "internal_net"
    bk.vm.provision "shell", path: "./backupserver/routing_vagrant.sh", run: "always"
  end

 config.vm.define "firewall" do |fr|
    fr.vm.box = OS
    fr.vm.provision "file", source: "./firewall/cert", destination: "firewall/cert"
    fr.vm.provision "file", source: "./firewall/rsyslog.conf", destination: "firewall/rsyslog.conf"
    fr.vm.provision "shell", path: "./firewall/setup_firewall.sh"
    fr.vm.network "private_network", ip: "172.27.0.254", virtualbox__intnet: "internal_net"
    fr.vm.network "private_network", ip: "172.26.0.254", virtualbox__intnet: "dmz"
  end

  config.vm.define "database" do |db|
    db.vm.box = OS
    db.vm.provision "file", source: "./database/imovies_users.sql", destination: "imovies_users.sql"
    db.vm.provision "file", source: "./database/initdatabase.sql", destination: "initdatabase.sql"
    db.vm.provision "file", source: "./database/cert", destination: "cert"
    db.vm.provision "file", source: "./database/my.cnf", destination: "my.cnf"
    db.vm.provision "file", source: "./database/rsyslog.conf", destination: "rsyslog.conf"
    db.vm.provision "shell", path: "./database/setup_database.sh"
    db.vm.network "private_network", ip: "172.27.0.3", virtualbox__intnet: "internal_net"
    db.vm.provision "shell", path: "./database/routing_vagrant.sh", run: "always"
  end

  config.vm.define "caserver" do |caserver|
    caserver.vm.box = OS
    caserver.vm.network "private_network", ip: "172.27.0.2", virtualbox__intnet: "internal_net"
    caserver.vm.provision "file", source: "./caserver/nginx", destination: "caserver/nginx"
    caserver.vm.provision "file", source: "./caserver/log", destination: "caserver/log"
    caserver.vm.provision "file", source: "./caserver/cert", destination: "caserver/cert"
    caserver.vm.provision "file", source: "./caserver/api", destination: "caserver/api"
    caserver.vm.provision "shell", path: "./caserver/setup_caserver.sh"
    caserver.vm.provision "shell", path: "./caserver/routing_vagrant.sh", run: "always"
  end

config.vm.define "webserver" do |wb|
    wb.vm.box = OS
    wb.vm.network "private_network", ip: "172.26.0.2", virtualbox__intnet: "dmz"
    wb.vm.provision "file", source: "./webserver/cert", destination: "webserver/cert"
    wb.vm.provision "file", source: "./webserver/nginx", destination: "webserver/nginx"
    wb.vm.provision "file", source: "./webserver/log", destination: "webserver/log"
    wb.vm.provision "file", source: "./webserver/frontend/build", destination: "webserver/frontend/build"
    wb.vm.provision "shell", path: "./webserver/setup_webserver.sh"
    wb.vm.provision "shell", path: "./webserver/routing_vagrant.sh", run: "always"
  end

end
