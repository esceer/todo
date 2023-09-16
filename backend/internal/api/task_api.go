package api

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/esceer/todo/backend/internal/api/model"
	"github.com/esceer/todo/backend/internal/common"
	"github.com/esceer/todo/backend/internal/service"
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
	if err = a.service.Save(&task); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
}

func (a *taskApi) Delete(w http.ResponseWriter, r *http.Request) {
	id, err := getIntPathParam(r, "id")
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if err = a.service.Delete(common.Identifier(id)); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
