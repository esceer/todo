package model

import (
	"time"

	"github.com/esceer/todo/backend/internal/common"
)

type Task struct {
	ID        common.Identifier
	Title     string
	Detail    *string
	Priority  *string
	Completed bool
	DueAt     *time.Time
	CreatedAt *time.Time
}
