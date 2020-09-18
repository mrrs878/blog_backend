#!/bin/bash

echo "updating code..."
git pull

echo "building image..."
docker build -t mrrs878/blog_backend:latest .

echo "stoping app..."
docker-compose down

echo "restarting app..."
docker-compose up -d

echo "hooray, succeeded!"
