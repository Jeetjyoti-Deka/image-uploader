package handler

import (
	"encoding/json"
	"net/http"

	"photo-uploader/internal/queue"
)

type StatusHandler struct {
	store queue.StatusStore
}

func NewStatusHandler(s queue.StatusStore) *StatusHandler {
	return &StatusHandler{store: s}
}

func (h *StatusHandler) GetStatus(w http.ResponseWriter, r *http.Request) {
	jobID := r.URL.Query().Get("job_id")

	status, err := h.store.GetStatus(jobID)
	if err != nil {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	json.NewEncoder(w).Encode(map[string]string{
		"job_id": jobID,
		"status": string(status),
	})
}
