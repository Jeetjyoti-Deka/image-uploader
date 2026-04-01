package handler

import (
	"encoding/json"
	"net/http"

	"photo-uploader/internal/model"
	"photo-uploader/internal/queue"
	"photo-uploader/internal/storage"

	"github.com/google/uuid"
)

type UploadHandler struct {
	Producer    *queue.JobProducer
	StatusStore queue.StatusStore
}

func NewUploadHandler(p *queue.JobProducer, statusStore queue.StatusStore) *UploadHandler {
	return &UploadHandler{Producer: p, StatusStore: statusStore}
}

func (h *UploadHandler) Upload(w http.ResponseWriter, r *http.Request) {
	err := r.ParseMultipartForm(10 << 20) // 10MB
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "file required", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// save locally
	path, err := storage.SaveFile(file, header.Filename)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	jobID := uuid.New().String()
	err = h.StatusStore.SetStatus(jobID, model.StatusPending)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	payload := model.JobPayload{
		JobID:    jobID,
		FilePath: path,
	}

	// push to queue
	err = h.Producer.Produce(payload)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	resp := map[string]string{
		"job_id": jobID,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)

}
