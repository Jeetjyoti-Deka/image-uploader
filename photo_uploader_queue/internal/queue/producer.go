package queue

import (
	"encoding/json"
	"photo-uploader/internal/model"
)

type JobProducer struct {
	queue Queue
}

func NewJobProducer(q Queue) *JobProducer {
	return &JobProducer{queue: q}
}

func (p *JobProducer) Produce(jobPayload model.JobPayload) error {
	bytes, err := json.Marshal(jobPayload)
	if err != nil {
		return err
	}
	return p.queue.Enqueue(bytes)
}
