# 🚀 Async Image Processing System

A **queue-based asynchronous image processing system** built with Go, Redis, and a worker pool architecture. This project demonstrates how to decouple API requests from heavy background processing using a scalable and fault-tolerant design.

---

## 📌 Overview

Instead of processing images synchronously during upload, this system:

- Accepts uploads via an API  
- Pushes jobs into a Redis-backed queue  
- Processes them asynchronously using worker goroutines  
- Tracks job status for real-time updates  

This ensures **fast APIs, better scalability, and improved reliability**.

---

## 🏗️ Architecture

```
Client → API (Producer) → Redis Queue → Workers (Consumers)
            ↓
         Status Store
```
---

## ⚙️ Features

- ⚡ **Async Upload API** (fire-and-forget pattern)  
- 📦 **Redis-backed Queue** using lists  
- 🔄 **Producer-Consumer Architecture**  
- 🧩 **Command Pattern** for extensible processing steps  
- 🧵 **Goroutine Worker Pool** for concurrency  
- 🔁 **Retry with Exponential Backoff**  
- 📊 **Job Status Tracking** (PENDING → PROCESSING → COMPLETED/FAILED)  
- 🔌 **Interface-based design** (easy to swap Redis with other systems)  
- 🐳 **Docker Compose setup** for local development  

---

## 🛠️ Tech Stack

- **Go (Golang)**
- **Redis**
- **Docker Compose**
- **React (Frontend)**

---

## 🚀 How It Works

1. User uploads an image via API  
2. API:
   - Saves file locally  
   - Generates a `job_id`  
   - Stores status as `PENDING`  
   - Pushes job to Redis queue  
3. Workers:
   - Pull jobs from queue  
   - Execute processing pipeline (resize, compress, thumbnail)  
   - Update job status  
4. Client polls status using `job_id`  

---

## 🧠 Concurrency Model

- Worker pool uses **goroutines**
- Example: 5 workers → 5 jobs processed concurrently  
- Extra jobs remain in `PENDING` until a worker becomes free  

---

## 🔁 Retry Strategy

- Failed jobs are retried up to **3 times**
- Uses **exponential backoff**:
  - 2s → 4s → 8s  
- Jobs are re-enqueued for retry  

---

## 📡 API Endpoints

### Upload Image


POST /upload


- Form-data: `file`
- Response:
```json
{
  "job_id": "uuid"
}
````

---

### Get Job Status

```
GET /status?job_id=<id>
```

* Response:

```json
{
  "job_id": "uuid",
  "status": "PENDING | PROCESSING | COMPLETED | FAILED"
}
```

---

## 🐳 Running Locally (Docker Compose)

```bash
docker-compose up -d (redis)
go run cmd/api/main.go (api server)
go run cmd/worker/main.go (worker pool)
```

---

## 🎥 Demo

👉 Upload multiple images simultaneously
👉 Watch jobs processed asynchronously
👉 Observe status transitions in real-time

---

## 📖 Blog

Detailed explanation of the architecture and implementation:
👉 [Add your blog link here]

---

## 💡 Key Learnings

* Designing **scalable async systems**
* Using Redis as both **queue and state store**
* Implementing **worker pools with Go**
* Applying **design patterns in real systems**

---

## 📌 Future Improvements

* Replace Redis with RabbitMQ/Kafka
* Add priority queues
* Store files in S3 instead of local disk
* Add WebSocket-based real-time updates (instead of polling)
* Improve frontend UI/UX
