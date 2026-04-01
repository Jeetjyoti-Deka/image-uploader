package queue

type Queue interface {
	Enqueue(payload []byte) error
	Dequeue() ([]byte, error)
}
