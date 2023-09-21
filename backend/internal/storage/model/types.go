package model

import (
	"time"

	"github.com/esceer/todo/backend/internal/common"
)

type Task struct {
	ID        common.Identifier
	Title     string
	Details   *string
	Priority  *string
	Completed *bool `gorm:"default:false"`
	DueAt     *time.Time
	CreatedAt *time.Time
}
