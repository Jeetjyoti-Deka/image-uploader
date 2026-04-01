package main

import (
	"photo-uploader/internal/queue/redis"
	"photo-uploader/internal/worker"
	"photo-uploader/internal/worker/command"
)

func main() {
	redisClient := redis.NewRedisClient()
	redisQueue := redis.NewRedisQueue(redisClient)
	statusStore := redisQueue

	pipeline := command.NewPipeline(
		&command.ResizeCommand{},
		&command.CompressCommand{},
		&command.ThumbnailCommand{},
	)

	w := worker.NewWorker(redisQueue, pipeline, statusStore)

	w.Start(5)
}
