package worker

import (
	"context"
	"encoding/json"
	"log"
	"time"

	"photo-uploader/internal/model"
	"photo-uploader/internal/queue"
	"photo-uploader/internal/worker/command"
)

const maxRetries = 3

type Worker struct {
	queue       queue.Queue
	statusStore queue.StatusStore
	pipeline    *command.Pipeline
}

func NewWorker(q queue.Queue, p *command.Pipeline, s queue.StatusStore) *Worker {
	return &Worker{
		queue:       q,
		pipeline:    p,
		statusStore: s,
	}
}

func (w *Worker) Start(concurrency int) {
	for i := range concurrency {
		go w.runWorker(i)
	}

	select {}
}

func (w *Worker) runWorker(id int) {
	log.Printf("starting worker: %d", id)
	for {
		data, err := w.queue.Dequeue()
		if err != nil {
			log.Println("worker: ", id, "dequeue error:", err)
			continue
		}

		var job model.JobPayload
		if err := json.Unmarshal(data, &job); err != nil {
			log.Println("worker: ", id, "invalid job:", err)
			continue
		}

		log.Println("worker: ", id, "Processing job:", job.JobID)

		if job.Retry == 0 {
			job.Retry = 1
		}

		// set PROCESSING
		_ = w.statusStore.SetStatusWithRetry(job.JobID, model.StatusProcessing, job.Retry)

		err = w.pipeline.Execute(context.Background(), job)
		if err != nil {
			log.Println("worker: ", id, "job failed:", err)

			job.Retry++

			if job.Retry <= maxRetries {
				log.Println("worker: ", id, "retrying job:", job.JobID, "attempt:", job.Retry)

				_ = w.statusStore.SetStatusWithRetry(job.JobID, model.StatusProcessing, job.Retry)

				// exponential backoff
				time.Sleep(time.Duration(1<<job.Retry) * time.Second)

				// re-enqueue job
				data, _ := json.Marshal(job)
				_ = w.queue.Enqueue(data)

				continue
			} else {
				log.Println("worker: ", id, "job failed after retries")
				_ = w.statusStore.SetStatusWithRetry(job.JobID, model.StatusFailed, job.Retry)
				continue
			}
		}
		// success
		_ = w.statusStore.SetStatus(job.JobID, model.StatusCompleted)
		log.Println("worker: ", id, "job completed:", job.JobID)
	}
}
