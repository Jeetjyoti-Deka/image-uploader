package queue

import "photo-uploader/internal/model"

type StatusStore interface {
	SetStatus(jobID string, status model.JobStatus) error
	GetStatus(jobID string) (model.JobStatus, error)
	SetStatusWithRetry(jobID string, status model.JobStatus, retry int) error
}
