package storage

import (
	"io"
	"os"
	"path/filepath"
)

func SaveFile(file io.Reader, filename string) (string, error) {
	path := filepath.Join("uploads", filename)

	out, err := os.Create(path)
	if err != nil {
		return "", err
	}

	defer out.Close()

	_, err = io.Copy(out, file)
	if err != nil {
		return "", err
	}

	return path, nil
}
