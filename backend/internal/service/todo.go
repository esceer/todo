package service

import (
	"github.com/esceer/todo/backend/internal/adapter"
	apimodel "github.com/esceer/todo/backend/internal/api/model"
	"github.com/esceer/todo/backend/internal/common"
	"github.com/esceer/todo/backend/internal/storage"
)

type TodoService interface {
	GetAll() ([]*apimodel.TaskResponse, error)
	Create(*apimodel.TaskCreate) error
	Patch(id common.Identifier, updates *apimodel.TaskUpdate) (*apimodel.TaskResponse, error)
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

func (s todoService) Create(apiTask *apimodel.TaskCreate) error {
	dbTask := adapter.ApiToDb(apiTask)
	_, err := s.store.Create(dbTask)
	return err
}

func (s todoService) Patch(id common.Identifier, updates *apimodel.TaskUpdate) (*apimodel.TaskResponse, error) {
	dbTask, err := s.store.GetById(id)
	if err != nil {
		return nil, err
	}
	if updates.Completed != nil {
		dbTask.Completed = *updates.Completed
	}
	dbTask, err = s.store.Update(dbTask)
	if err != nil {
		return nil, err
	}
	return adapter.DbToApi(dbTask), nil
}

func (s todoService) Delete(id common.Identifier) error {
	return s.store.Delete(id)
}
