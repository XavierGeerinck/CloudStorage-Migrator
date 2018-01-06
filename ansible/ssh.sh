#!/bin/bash
KEY_PATH=~/.ssh/id_rsa

# Enable ssh-agent
if [ -z "$SSH_AUTH_SOCK" ]; then
    eval "$(ssh-agent)"
fi

# Add our SSH key if not added yet
if  ssh-add -l | \
    grep -q "$(ssh-keygen -lf $KEY_PATH | awk '{print $2}')"; \
    then echo "Key already added, continuing...."; \
    else ssh-add "$KEY_PATH"; \
fi

ssh "$@"

# RIP all the SSH Agents
pkill -f ssh-agent