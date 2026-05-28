package main

import (
	"log"
	"net/http"

	"github.com/auzt/simple-tasklist/backend/internal/config"
	"github.com/auzt/simple-tasklist/backend/internal/infrastructure"
	"github.com/auzt/simple-tasklist/backend/internal/modules/task"
	"github.com/gin-gonic/gin"
)

func main() {
	// Load configuration
	cfg := config.LoadConfig()

	// Initialize Database
	infrastructure.InitDB(cfg.DatabaseURL)

	// Setup repository, service, handler for Task module
	taskRepo := task.NewRepository(infrastructure.DB)
	taskService := task.NewService(taskRepo)
	taskHandler := task.NewHandler(taskService)

	// Auto migrate tables
	if err := taskService.AutoMigrate(); err != nil {
		log.Fatalf("failed to auto migrate database: %v", err)
	}
	log.Println("Database migration completed.")

	// Set Gin mode
	gin.SetMode(gin.ReleaseMode)

	// Setup Router
	r := gin.New()
	r.Use(gin.Recovery())

	// Custom CORS middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Health Check Route
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "UP"})
	})

	// API V1 Group
	apiV1 := r.Group("/api/v1")
	task.RegisterRoutes(apiV1, taskHandler)

	// Start server
	log.Printf("Starting API server on port :%s\n", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("failed to start server: %v", err)
	}
}
