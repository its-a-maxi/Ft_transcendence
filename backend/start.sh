#!/bin/bash

# install dependencies
npm install

#exec main process (in docker-compose service)
exec "$@"