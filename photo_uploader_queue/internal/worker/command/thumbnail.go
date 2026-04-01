package command

import (
	"context"
	"time"
)

type ThumbnailCommand struct{}

func (c *ThumbnailCommand) Execute(ctx context.Context, payload any) error {
	println("Generating thumbnail...")
	time.Sleep(4 * time.Second)
	return nil
}
