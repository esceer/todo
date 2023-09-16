package main

import (
	"net/http"

	"github.com/esceer/todo/backend/cmd/setup"
	"github.com/rs/zerolog/log"
)

func main() {
	// Config
	cfg, err := setup.Config()
	if err != nil {
		log.Fatal().Msgf("Startup failed while reading config: %v", err)
	}
	setup.Logger(cfg)

	// Database
	if err = setup.RunMigrationScripts(cfg); err != nil {
		log.Fatal().Err(err).Msg("DB migration failed")
	}
	database, err := setup.ConnectToDB(cfg)
	if err != nil {
		log.Fatal().Err(err).Msg("Connecting to DB failed")
	}

	// Services
	todoService := setup.TodoService(database)

	// Http server
	setup.WebRouting(todoService)
	log.Info().Msgf("Listening on %v...", cfg.ServerAddress)
	log.Fatal().Msg(http.ListenAndServe(cfg.ServerAddress, nil).Error())
}
