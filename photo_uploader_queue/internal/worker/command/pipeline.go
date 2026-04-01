package command

import "context"

type Pipeline struct {
	commands []Command
}

func NewPipeline(cmds ...Command) *Pipeline {
	return &Pipeline{commands: cmds}
}

func (p *Pipeline) Execute(ctx context.Context, payload any) error {
	for _, cmd := range p.commands {
		if err := cmd.Execute(ctx, payload); err != nil {
			return err
		}
	}
	return nil
}
