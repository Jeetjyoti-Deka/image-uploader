package redis

import (
	"context"
)

type RedisQueue struct {
	redis *RedisClient
}

var Ctx = context.Background()

func NewRedisQueue(client *RedisClient) *RedisQueue {
	return &RedisQueue{redis: client}
}

func (r *RedisQueue) Enqueue(payload []byte) error {
	return r.redis.Client.LPush(Ctx, "image_jobs", payload).Err()
}

func (r *RedisQueue) Dequeue() ([]byte, error) {
	result, err := r.redis.Client.BRPop(Ctx, 0, "image_jobs").Result()
	if err != nil {
		return nil, err
	}
	return []byte(result[1]), nil
}
