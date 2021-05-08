# dashboard后端代码

[![Build Status](https://www.travis-ci.org/mrrs878/monitor_backend.svg?branch=master)](https://www.travis-ci.org/mrrs878/monitor_backend)

Nest.js + Typescript + MongoDB

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
