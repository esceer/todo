package api

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	"github.com/esceer/todo/backend/internal/api/model"
	"github.com/esceer/todo/backend/internal/common"
	"github.com/esceer/todo/backend/internal/service"
	"github.com/esceer/todo/backend/internal/storage"
)

type taskApi struct {
	service service.TodoService
}

func NewTaskApiHandler(s service.TodoService) *taskApi {
	return &taskApi{
		service: s,
	}
}

func (a *taskApi) GetAll(w http.ResponseWriter, r *http.Request) {
	tasks, err := a.service.GetAll()
	if err != nil {
		fmt.Fprint(w, err.Error())
		return
	}
	if err = json.NewEncoder(w).Encode(tasks); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func (a *taskApi) Create(w http.ResponseWriter, r *http.Request) {
	task, err := getBody[model.TaskCreate](r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if err = a.service.Create(&task); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
}

func (a *taskApi) Patch(w http.ResponseWriter, r *http.Request) {
	id, err := getIntPathParam(r, "id")
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	updates, err := getBody[model.TaskUpdate](r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	updatedTask, err := a.service.Patch(common.Identifier(id), &updates)
	if err != nil {
		if errors.Is(err, storage.ErrNotFound) {
			http.Error(w, err.Error(), http.StatusNotFound)
		} else {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}
	if err = json.NewEncoder(w).Encode(updatedTask); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func (a *taskApi) Delete(w http.ResponseWriter, r *http.Request) {
	id, err := getIntPathParam(r, "id")
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if err = a.service.Delete(common.Identifier(id)); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
