package storage

import (
	"github.com/esceer/todo/backend/internal/common"
	"github.com/esceer/todo/backend/internal/storage/model"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type TaskStore interface {
	GetAll() ([]*model.Task, error)
	GetById(common.Identifier) (*model.Task, error)
	Create(*model.Task) (*model.Task, error)
	Update(task *model.Task) (*model.Task, error)
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

func (s *dbStore) GetById(id common.Identifier) (*model.Task, error) {
	var task model.Task
	result := s.db.Preload(clause.Associations).First(&task, id)
	if result.Error == gorm.ErrRecordNotFound {
		return nil, ErrNotFound
	}
	return &task, result.Error
}

func (s *dbStore) Create(task *model.Task) (*model.Task, error) {
	return task, s.db.Create(task).Error
}

func (c *dbStore) Update(task *model.Task) (*model.Task, error) {
	if _, err := c.GetById(task.ID); err != nil {
		return nil, err
	}
	result := c.db.Updates(task)
	return task, result.Error
}

func (s *dbStore) Delete(id common.Identifier) error {
	return s.db.Delete(&model.Task{}, id).Error
}
