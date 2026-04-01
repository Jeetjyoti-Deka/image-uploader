package command

import (
	"context"
	"time"
)

type CompressCommand struct{}

func (c *CompressCommand) Execute(ctx context.Context, payload any) error {
	println("Compressing image...")
	time.Sleep(4 * time.Second)
	return nil
}
