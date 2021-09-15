<!--
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-07-13 23:28:27
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-07-20 22:13:57
 * @FilePath: \blog_backend\README.md
-->
# dashboard后端代码

[![Build Status](https://www.travis-ci.org/mrrs878/monitor_backend.svg?branch=master)](https://www.travis-ci.org/mrrs878/monitor_backend)
[![Node.js CI](https://github.com/mrrs878/blog_backend/actions/workflows/node.js.yml/badge.svg)](https://github.com/mrrs878/blog_backend/actions/workflows/node.js.yml)

Nest.js + Typescript + MongoDB

## 一些常见问题

1. win10本地在启动redis服务时，有时会出现如下报错`Creating Server TCP listening socket 127.0.0.1:637 9: bind: No error`

``` shell
Redis-cli.exe
shutdown
exit
redis-server.exe redis.windows.conf
```


## docker 指令

``` shell
# 查看运行中的实例
docker ps

# 进入实例
docker exec -it container_name /bin/sh
```

## redis命令

``` shell
# 进入redis
docker exec -it blog_cache /bin/sh

# 启动redis客户端
redis-cli

# 测试
ping

#--> pong

# 查看所有key
keys *

# 获取value
get key_name

# 删除value
del key_name
```

## mongoDB指令

``` shell
# 进入mongo
docker exec -it _database /bin/sh

# 启动mongo客户端
mongo

# 使用某一database
use test

# 查看database下所有的collection
db.artile.find({})
```
