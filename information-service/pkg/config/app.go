package config

import (
	"information/pkg/mongoDB"

	"go.mongodb.org/mongo-driver/mongo"
)

// AppConfig holds the application config
type AppConfig struct {
	DB     *mongo.Client
	Models mongoDB.Models
}
