package setup

import (
	"github.com/esceer/todo/backend/internal/service"
	"github.com/esceer/todo/backend/internal/storage"
	"gorm.io/gorm"
)

func TodoService(db *gorm.DB) service.TodoService {
	store := storage.NewDBStore(db)
	return service.NewTodoService(store)
}
