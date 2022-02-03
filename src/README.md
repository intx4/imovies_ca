In each folder you can find the code and setup deployed on each machine :)

## MOVE YOUR VENV from caserver/api to caserver 
otherwise vagrant will try to copy it to the CA VM (taking too much time)

## Installing Vagrant
Follow this [link](https://www.vagrantup.com/downloads) and your wishes shall
be granted

## Installing the Webserver
In order to keep the attack surface the VM as small as possible we do not install 
npm or nodejs on the server everything is built locally
Hence before using vagrant do the following:
```shell
cd webserver/frontend
nmp install
npm run build
```
From there you can run `vagrant up webserver`.

## Backupserver
password of private key: K8j3HzCbU28zDHuareDf

## Virtual Machines and Vagrant
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
