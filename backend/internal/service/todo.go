package service

import (
	"github.com/esceer/todo/backend/internal/adapter"
	apimodel "github.com/esceer/todo/backend/internal/api/model"
	"github.com/esceer/todo/backend/internal/common"
	"github.com/esceer/todo/backend/internal/storage"
)

type TodoService interface {
	GetAll() ([]*apimodel.TaskResponse, error)
	Save(*apimodel.TaskCreate) error
	Delete(common.Identifier) error
}

type todoService struct {
	store storage.TaskStore
}

func NewTodoService(s storage.TaskStore) TodoService {
	return &todoService{s}
}

func (s todoService) GetAll() ([]*apimodel.TaskResponse, error) {
	tasks, err := s.store.GetAll()
	return adapter.DbSliceToApiSlice(tasks), err
}

func (s todoService) Save(apiTask *apimodel.TaskCreate) error {
	dbTask := adapter.ApiToDb(apiTask)
	return s.store.Save(dbTask)
}

func (s todoService) Delete(id common.Identifier) error {
	return s.store.Delete(id)
}
