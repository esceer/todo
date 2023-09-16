package config

// Config is the structure for the configuration data read from the env
type Config struct {
	ServerAddress string `envconfig:"SERVER_ADDRESS" default:":8081"`

	DataSource string `envconfig:"DATA_SOURCE" default:"todo.db"`

	LogLevel             int  `envconfig:"LOG_LEVEL" default:"1"` // trace: -1, debug: 0, info: 1, warn: 2
	HumanFriendlyLogging bool `envconfig:"HUMAN_FRIENDLY_LOGGING" default:"true"`
}

// NewConfig returns a config instance initialized with default values
func NewConfig() *Config {
	return &Config{}
}
