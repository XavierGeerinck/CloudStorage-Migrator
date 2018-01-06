# How to deploy
1. Make sure you can reach the host (try `ansible all -m ping`)

## Tools
* `ssh.sh`: This file allows you to connect to a server with Agent Forwarding (usage: `./ssh root@<ip>`)

## FAQ
**SSH Error: data could not be sent to the remote host. Make sure this host can be reached over ssh**
Make sure that the connection details are correct (see hosts file, and check ip and user)