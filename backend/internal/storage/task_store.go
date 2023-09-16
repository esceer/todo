package storage

import (
	"github.com/esceer/todo/backend/internal/common"
	"github.com/esceer/todo/backend/internal/storage/model"
	"gorm.io/gorm"
)

type TaskStore interface {
	GetAll() ([]*model.Task, error)
	Save(*model.Task) error
	Delete(common.Identifier) error
}

type dbStore struct {
	db *gorm.DB
}

func NewDBStore(db *gorm.DB) TaskStore {
	return &dbStore{db: db}
}

func (s *dbStore) GetAll() ([]*model.Task, error) {
	var tasks []*model.Task
	result := s.db.Find(&tasks)
	return tasks, result.Error
}

func (s *dbStore) Save(task *model.Task) error {
	return s.db.Save(task).Error
}

func (s *dbStore) Delete(id common.Identifier) error {
	return s.db.Delete(&model.Task{}, id).Error
}
