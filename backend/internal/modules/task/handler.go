package task

import (
	"strconv"

	"github.com/auzt/simple-tasklist/backend/pkg/response"
	"github.com/gin-gonic/gin"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) GetTasks(c *gin.Context) {
	tasks, err := h.service.GetAllTasks(c.Request.Context())
	if err != nil {
		response.Error(c, 500, "failed to get tasks: "+err.Error())
		return
	}
	response.Success(c, 200, "tasks retrieved successfully", tasks)
}

func (h *Handler) CreateTask(c *gin.Context) {
	var dto CreateTaskDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		response.Error(c, 400, "invalid request body: "+err.Error())
		return
	}

	task, err := h.service.CreateTask(c.Request.Context(), dto)
	if err != nil {
		response.Error(c, 500, "failed to create task: "+err.Error())
		return
	}
	response.Success(c, 201, "task created successfully", task)
}

func (h *Handler) UpdateTask(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		response.Error(c, 400, "invalid task id")
		return
	}

	var dto UpdateTaskDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		response.Error(c, 400, "invalid request body: "+err.Error())
		return
	}

	task, err := h.service.UpdateTask(c.Request.Context(), uint(id), dto)
	if err != nil {
		response.Error(c, 500, "failed to update task: "+err.Error())
		return
	}
	response.Success(c, 200, "task updated successfully", task)
}

func (h *Handler) DeleteTask(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		response.Error(c, 400, "invalid task id")
		return
	}

	err = h.service.DeleteTask(c.Request.Context(), uint(id))
	if err != nil {
		response.Error(c, 500, "failed to delete task: "+err.Error())
		return
	}
	response.Success(c, 200, "task deleted successfully", nil)
}

func (h *Handler) DeleteCompletedTasks(c *gin.Context) {
	err := h.service.DeleteCompletedTasks(c.Request.Context())
	if err != nil {
		response.Error(c, 500, "failed to delete completed tasks: "+err.Error())
		return
	}
	response.Success(c, 200, "completed tasks deleted successfully", nil)
}
