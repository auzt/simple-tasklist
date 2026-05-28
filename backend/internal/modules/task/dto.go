package task

import (
	"time"
)

type Task struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Title     string    `gorm:"size:255;not null" json:"title"`
	Completed bool      `gorm:"default:false;not null" json:"completed"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type CreateTaskDTO struct {
	Title string `json:"title" binding:"required,min=1"`
}

type UpdateTaskDTO struct {
	Title     *string `json:"title"`
	Completed *bool   `json:"completed"`
}
