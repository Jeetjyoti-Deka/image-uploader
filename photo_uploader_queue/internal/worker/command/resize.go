package command

import (
	"context"
	"time"
)

type ResizeCommand struct{}

func (c *ResizeCommand) Execute(ctx context.Context, payload any) error {
	println("Resizing image...")
	time.Sleep(4 * time.Second)
	return nil
}
