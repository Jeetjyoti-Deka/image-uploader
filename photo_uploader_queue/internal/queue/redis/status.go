package redis

import (
	"context"
	"photo-uploader/internal/model"
)

func (r *RedisQueue) SetStatus(jobID string, status model.JobStatus) error {
	key := "job:" + jobID

	return r.redis.Client.HSet(context.Background(), key, map[string]interface{}{
		"status":     string(status),
		"updated_at": "now",
	}).Err()
}

func (r *RedisQueue) GetStatus(jobID string) (model.JobStatus, error) {
	key := "job:" + jobID

	val, err := r.redis.Client.HGet(context.Background(), key, "status").Result()
	if err != nil {
		return "", err
	}

	return model.JobStatus(val), nil
}

func (r *RedisQueue) SetStatusWithRetry(jobID string, status model.JobStatus, retry int) error {
	key := "job:" + jobID

	return r.redis.Client.HSet(context.Background(), key, map[string]interface{}{
		"status": string(status),
		"retry":  retry,
	}).Err()
}
