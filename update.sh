#!/bin/bash

echo "stoping app..."
docker-compose down

echo "removing image(s)..."
docker image rm mrrs878/blog_backend:master

echo "restarting app..."
docker-compose up -d

echo "hooray, succeeded!"
