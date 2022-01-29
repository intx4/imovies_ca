# MOVE YOUR VENV from caserver/api to caserver 
otherwise vagrant will try to copy it to the CA VM (taking too much time)

# Installing Vagrant
Follow this [link](https://www.vagrantup.com/downloads) and your wishes shall
be granted

# Installing the Webserver
In order to keep the attack surface the VM as small as possible we do not install 
npm or nodejs on the server everything is built locally
Hence before using vagrant do the following:
```shell
cd webserver/frontend
nmp install
npm run build
```
From there you can run `vagrant up webserver`.

# Backupserver
password of private key: K8j3HzCbU28zDHuareDf

# Virtual Machines and Vagrant
When running vagrant ensure that you are in the root directory of this project.
All the setup is in the `Vagrantfile`

`vagrant up` spawns all the VMs  
`vagrant up [name]` only spawns the VM mentioned  
`vagrant destroy` destroys the VM similar to `docker-compose down`  
`vagrant destroy [name]` only destroys the VM mentioned  
`vagrant provision` run all the provision commands in the `VagrantFile`  
`vagrant provision [name]` only runs the provision of the machine specified  
`vagrant status` shows you what services are currently running

`vagrant ssh [name]` ssh you inside the VM mentioned,

**You can also see the VMs by opening virtual box**

## TODOS

### Database
Seem to work fine, no problem there
backup encryption passphrase:
26qdJ6ZJsPz9QKOCm86P

### CaServer
Seem to work fine, no problem there

### Webserver
- Need to add user authentication with certificate + admin authentication
- Need to save user certificate to backup

#### Certificate Authentication
- 1: user uploads his pkcs12 file into browser (use chrome or chromium cause Firefox has a bug wrt pkcs12 that are not encrypted).
- 2: user tries to go to login_w_cert. If he has a certificate he can access the page, ow Nginx throws 403
- 3: user clicks Login and triggers a get request to api/login_with_cert. From here nginx will proxy the request to the backend adding the serial of the certificate in the header as X-serial
- 4: the backend will look for the certificate using the serial trying to see if the certificate is still valid and then if the owner is a admin

### Firewall
Settup and running

## Things that need to be done before submitting the project
- Check all the TODOs in the project then do `vagrant destroy` `vagrant up`
- Change the vagrant user to admin user with a hard password
- Disable ssh vagrant
- Disable the no password sudo property of the vagrant user
