#!/bin/bash
###
 # @Author: mrrs878@foxmail.com
 # @Date: 2021-07-12 17:25:42
 # @LastEditors: mrrs878@foxmail.com
 # @LastEditTime: 2021-07-12 17:35:01
 # @FilePath: \blog_backend\update.sh
### 

echo "updating code..."
git pull

echo "building image..."
docker build -t mrrs878/backend:latest .

echo "hooray, succeeded!"
