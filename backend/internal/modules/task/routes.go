package task

import (
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.RouterGroup, handler *Handler) {
	tasks := r.Group("/tasks")
	{
		tasks.GET("", handler.GetTasks)
		tasks.POST("", handler.CreateTask)
		tasks.PUT("/:id", handler.UpdateTask)
		tasks.DELETE("/:id", handler.DeleteTask)
		tasks.DELETE("/completed", handler.DeleteCompletedTasks)
	}
}
