package config

import (
	"log"

	"github.com/spf13/viper"
)

type Config struct {
	Port        string `mapstructure:"PORT"`
	DatabaseURL string `mapstructure:"DATABASE_URL"`
}

func LoadConfig() *Config {
	viper.SetDefault("PORT", "8080")
	viper.SetDefault("DATABASE_URL", "postgres://postgres:supersecretpassword123@localhost:5432/playground_db?sslmode=disable")

	viper.AutomaticEnv()

	var config Config
	if err := viper.Unmarshal(&config); err != nil {
		log.Fatalf("unable to decode config: %v", err)
	}

	return &config
}
