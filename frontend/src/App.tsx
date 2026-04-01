import { useState, useEffect, useRef } from "react";

const styles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body, html {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif;
    background: linear-gradient(135deg, #f5f7fa 0%, #e9ecf0 100%);
    color: #1a202c;
  }

  .app-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .header {
    background: white;
    border-bottom: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    padding: 24px 0;
  }

  .header-content {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 24px;
  }

  .header h1 {
    font-size: 32px;
    font-weight: 700;
    color: #1a202c;
  }

  .header p {
    margin-top: 8px;
    color: #718096;
    font-size: 14px;
  }

  .main-content {
    max-width: 1280px;
    margin: 0 auto;
    padding: 48px 24px;
    width: 100%;
    flex: 1;
  }

  .grid-layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: 32px;
  }

  @media (min-width: 1024px) {
    .grid-layout {
      grid-template-columns: 300px 1fr;
    }
  }

  .upload-section {
    height: fit-content;
  }

  .upload-btn {
    width: 100%;
    padding: 16px 32px;
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);
  }

  .upload-btn:hover {
    background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
    box-shadow: 0 10px 15px rgba(37, 99, 235, 0.3);
    transform: translateY(-2px);
  }

  .upload-btn:active {
    transform: scale(0.95);
  }

  .upload-hint {
    margin-top: 12px;
    text-align: center;
    color: #718096;
    font-size: 13px;
  }

  .uploads-container {
    background: white;
    border-radius: 12px;
    padding: 32px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
    border: 1px solid #e2e8f0;
  }

  .uploads-header {
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 16px;
    margin-bottom: 24px;
  }

  .uploads-header h2 {
    font-size: 24px;
    font-weight: 700;
    color: #1a202c;
  }

  .uploads-header p {
    margin-top: 8px;
    color: #718096;
    font-size: 13px;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
    text-align: center;
  }

  .empty-state-icon {
    font-size: 60px;
    margin-bottom: 16px;
  }

  .empty-state h3 {
    font-size: 18px;
    font-weight: 600;
    color: #718096;
  }

  .empty-state p {
    margin-top: 8px;
    color: #a0aec0;
    font-size: 14px;
  }

  .jobs-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .job-item {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 16px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background: white;
    transition: all 0.2s ease;
  }

  .job-item:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #cbd5e0;
  }

  .job-info {
    flex: 1;
  }

  .job-id {
    font-family: "Monaco", "Courier New", monospace;
    font-size: 13px;
    font-weight: 600;
    color: #1a202c;
    word-break: break-all;
  }

  .job-meta {
    margin-top: 8px;
    font-size: 12px;
    color: #a0aec0;
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 600;
    margin-left: 12px;
    white-space: nowrap;
  }

  .status-completed {
    background: #dcfce7;
    color: #166534;
  }

  .status-failed {
    background: #fee2e2;
    color: #991b1b;
  }

  .status-processing {
    background: #fed7aa;
    color: #92400e;
  }

  .status-pending {
    background: #f3f4f6;
    color: #374151;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
  }

  .modal-content {
    background: white;
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
    max-width: 448px;
    width: 100%;
    margin: 0 20px;
  }

  .modal-header h2 {
    font-size: 24px;
    font-weight: 700;
    color: #1a202c;
  }

  .modal-header p {
    margin-top: 8px;
    color: #718096;
    font-size: 14px;
  }

  .modal-form {
    margin-top: 20px;
    margin-bottom: 24px;
  }

  .file-input {
    display: none;
  }

  .upload-zone {
    border: 2px dashed #cbd5e0;
    border-radius: 8px;
    padding: 32px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
    background: #f9fafb;
  }

  .upload-zone:hover {
    border-color: #a0aec0;
    background: #f3f4f6;
  }

  .upload-zone.dragging {
    border-color: #2563eb;
    background: #eff6ff;
  }

  .upload-zone.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .upload-zone-icon {
    font-size: 36px;
    margin-bottom: 12px;
  }

  .upload-zone-title {
    font-weight: 600;
    color: #1a202c;
    font-size: 15px;
  }

  .upload-zone-hint {
    margin-top: 8px;
    font-size: 13px;
    color: #718096;
  }

  .modal-buttons {
    display: flex;
    gap: 12px;
  }

  .btn-secondary {
    flex: 1;
    padding: 12px 16px;
    border: 1px solid #cbd5e0;
    border-radius: 8px;
    background: white;
    color: #4a5568;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 14px;
  }

  .btn-secondary:hover:not(:disabled) {
    background: #f7fafc;
  }

  .btn-secondary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

type Job = {
  jobId: string;
  status: string;
};

export default function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showModal, setShowModal] = useState(false);
  const jobsRef = useRef<Job[]>([]);

  const addJob = (jobId: string) => {
    setJobs((prev) => [...prev, { jobId, status: "PENDING" }]);
  };

  useEffect(() => {
    jobsRef.current = jobs;
  }, [jobs]);

  // Polling
  useEffect(() => {
    const interval = setInterval(async () => {
      const updatedJobs = await Promise.all(
        jobsRef.current.map(async (job) => {
          if (job.status === "COMPLETED" || job.status === "FAILED") return job;

          const res = await fetch(
            `http://localhost:8080/status?job_id=${job.jobId}`,
          );
          if (!res.ok) return job;

          const data = await res.json();
          return { ...job, status: data.status };
        }),
      );

      setJobs(updatedJobs);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="app-container">
        {/* Header */}
        <header className="header">
          <div className="header-content">
            <h1>Image Processor</h1>
            <p>Upload and process your images</p>
          </div>
        </header>

        {/* Main Content */}
        <div className="main-content">
          <div className="grid-layout">
            {/* Upload Section */}
            <div className="upload-section">
              <button onClick={() => setShowModal(true)} className="upload-btn">
                + Upload Image
              </button>
              <p className="upload-hint">
                Click to select and process an image
              </p>
            </div>

            {/* Uploads List */}
            <div className="uploads-container">
              <div className="uploads-header">
                <h2>Upload History</h2>
                <p>
                  {jobs.length} {jobs.length === 1 ? "item" : "items"}
                </p>
              </div>

              {jobs.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📁</div>
                  <h3>No uploads yet</h3>
                  <p>Click the upload button to get started</p>
                </div>
              ) : (
                <div className="jobs-list">
                  {jobs.map((job) => (
                    <JobItem key={job.jobId} job={job} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <UploadModal
            onClose={() => setShowModal(false)}
            onUploaded={addJob}
          />
        )}
      </div>
    </>
  );
}

function UploadModal({
  onClose,
  onUploaded,
}: {
  onClose: () => void;
  onUploaded: (jobId: string) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async (files: FileList) => {
    if (!files || files.length == 0) return;

    setIsLoading(true);
    for (let file of files) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("http://localhost:8080/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        onUploaded(data.job_id);
        onClose();
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files) handleUpload(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files && e.target.files;
    if (files) handleUpload(files);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Upload Image</h2>
          <p>Select an image to process</p>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="modal-form">
          <label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={isLoading}
              className="file-input"
              multiple
            />
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`upload-zone ${isDragging ? "dragging" : ""} ${
                isLoading ? "disabled" : ""
              }`}
            >
              <div className="upload-zone-icon">🖼️</div>
              <p className="upload-zone-title">
                {isLoading ? "Uploading..." : "Drag and drop your image"}
              </p>
              <p className="upload-zone-hint">or click to browse</p>
            </div>
          </label>
        </form>

        <div className="modal-buttons">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function JobItem({ job }: { job: Job }) {
  const getStatusConfig = () => {
    const configs: Record<string, { className: string; icon: string }> = {
      COMPLETED: {
        className: "status-completed",
        icon: "✅",
      },
      FAILED: {
        className: "status-failed",
        icon: "❌",
      },
      PROCESSING: {
        className: "status-processing",
        icon: "⏳",
      },
      PENDING: {
        className: "status-pending",
        icon: "⏱️",
      },
    };
    return configs[job.status] || configs.PENDING;
  };

  const config = getStatusConfig();

  return (
    <div className="job-item">
      <div className="job-info">
        <p className="job-id">{job.jobId}</p>
        <p className="job-meta">Upload processed</p>
      </div>
      <span className={`status-badge ${config.className}`}>
        <span>{config.icon}</span>
        {job.status}
      </span>
    </div>
  );
}
