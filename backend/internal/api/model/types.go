package model

import (
	"time"

	"github.com/esceer/todo/backend/internal/common"
)

type TaskCreate struct {
	Title    string
	Detail   string
	Priority string
	DueAt    time.Time
}

type TaskResponse struct {
	ID        common.Identifier
	Title     string
	Detail    string
	Priority  string
	DueAt     time.Time
	CreatedAt time.Time
}
