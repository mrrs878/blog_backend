#!/bin/bash

echo "stoping app..."
docker-compose down

echo "restarting app..."
docker-compose up -d

echo "hooray, succeeded!"
