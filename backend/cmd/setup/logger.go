package setup

import (
	"os"

	"github.com/esceer/todo/backend/cmd/config"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

func Logger(config *config.Config) {
	zerolog.TimestampFieldName = "datetime"
	zerolog.LevelFieldName = "loglevel"
	zerolog.MessageFieldName = "message"
	zerolog.SetGlobalLevel(zerolog.Level(config.LogLevel))
	log.Logger = log.With().Str("component", "todo-backend").Logger()
	if config.HumanFriendlyLogging {
		log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr})
	}
}
