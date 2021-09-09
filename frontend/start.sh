#!/bin/bash

# # update npm
# npm install -g npm@7.21.0

# install dependencies
npm install

#exec main process (in docker-compose service)
exec "$@"