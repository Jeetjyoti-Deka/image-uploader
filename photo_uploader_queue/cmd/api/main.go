package main

import (
	"log"
	"net/http"

	"photo-uploader/internal/handler"
	"photo-uploader/internal/queue"
	"photo-uploader/internal/queue/redis"
)

func main() {
	redisClient := redis.NewRedisClient()
	redisQueue := redis.NewRedisQueue(redisClient)
	producer := queue.NewJobProducer(redisQueue)
	statusStore := redisQueue

	uploadHandler := handler.NewUploadHandler(producer, statusStore)
	statusHandler := handler.NewStatusHandler(statusStore)

	mux := http.NewServeMux()

	mux.HandleFunc("/upload", uploadHandler.Upload)
	mux.HandleFunc("/status", statusHandler.GetStatus)

	// Wrap with CORS middleware
	handlerWithCORS := handler.CORSMiddleware(mux)

	log.Println("API running on :8080")
	log.Fatal(http.ListenAndServe(":8080", handlerWithCORS))
}
