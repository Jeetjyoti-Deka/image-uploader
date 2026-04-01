package redis

import (
	"github.com/redis/go-redis/v9"
)

type RedisClient struct {
	Client *redis.Client
}

func NewRedisClient() *RedisClient {
	rdb := redis.NewClient(&redis.Options{
		Addr: "localhost:6379",
	})

	return &RedisClient{Client: rdb}
}
