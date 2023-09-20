package setup

import (
	"net/http"

	apispec "github.com/esceer/todo/backend/api"
	"github.com/esceer/todo/backend/internal/api"
	"github.com/esceer/todo/backend/internal/middleware"
	"github.com/esceer/todo/backend/internal/service"
	swaggerui "github.com/esceer/todo/swagger-ui"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func WebRouting(todoService service.TodoService) {
	router := mux.NewRouter()
	vr := router.PathPrefix("/todo").Subrouter()

	cr := vr.PathPrefix("/tasks").Subrouter()
	taskApi := api.NewTaskApiHandler(todoService)
	cr.HandleFunc("", taskApi.GetAll).Methods("GET")
	cr.HandleFunc("", taskApi.Create).Methods("POST")
	cr.HandleFunc("/{id}", taskApi.Patch).Methods("PATCH")
	cr.HandleFunc("/{id}", taskApi.Delete).Methods("DELETE")

	http.Handle("/", withCorsSetup(withLogging(router)))
	http.Handle("/swagger-ui/", http.StripPrefix("/swagger-ui", swaggerui.Handler(apispec.ApiSpec)))
}

func withLogging(h http.Handler) http.Handler {
	middleware := middleware.NewLoggingMiddleware()
	return middleware.WithHTTPLogging(h)
}

func withCorsSetup(h http.Handler) http.Handler {
	return cors.AllowAll().Handler(h)
}
