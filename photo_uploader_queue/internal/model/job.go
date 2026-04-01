package model

type JobStatus string

const (
	StatusPending    JobStatus = "PENDING"
	StatusProcessing JobStatus = "PROCESSING"
	StatusCompleted  JobStatus = "COMPLETED"
	StatusFailed     JobStatus = "FAILED"
)

type JobPayload struct {
	JobID    string `json:"job_id"`
	FilePath string `json:"file_path"`
	Retry    int    `json:"retry"`
}
