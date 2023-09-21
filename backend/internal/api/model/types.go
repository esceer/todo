package model

import (
	"time"

	"github.com/esceer/todo/backend/internal/common"
)

type TaskCreate struct {
	Title    string
	Details  *string
	Priority *string
	DueAt    *common.DateTimeShort
}

type TaskUpdate struct {
	Completed *bool
}

type TaskResponse struct {
	ID        common.Identifier     `json:"id"`
	Title     string                `json:"title"`
	Details   *string               `json:"details,omitempty"`
	Priority  *string               `json:"priority,omitempty"`
	Completed bool                  `json:"completed"`
	DueAt     *common.DateTimeShort `json:"dueAt,omitempty"`
	CreatedAt time.Time             `json:"createdAt"`
}
