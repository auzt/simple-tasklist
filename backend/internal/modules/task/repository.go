package task

import (
	"context"

	"gorm.io/gorm"
)

type Repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) AutoMigrate() error {
	return r.db.AutoMigrate(&Task{})
}

func (r *Repository) FindAll(ctx context.Context) ([]Task, error) {
	var tasks []Task
	err := r.db.WithContext(ctx).Order("id asc").Find(&tasks).Error
	return tasks, err
}

func (r *Repository) Create(ctx context.Context, task *Task) error {
	return r.db.WithContext(ctx).Create(task).Error
}

func (r *Repository) FindByID(ctx context.Context, id uint) (*Task, error) {
	var task Task
	err := r.db.WithContext(ctx).First(&task, id).Error
	if err != nil {
		return nil, err
	}
	return &task, nil
}

func (r *Repository) Update(ctx context.Context, task *Task) error {
	return r.db.WithContext(ctx).Save(task).Error
}

func (r *Repository) Delete(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Delete(&Task{}, id).Error
}

func (r *Repository) DeleteCompleted(ctx context.Context) error {
	return r.db.WithContext(ctx).Where("completed = ?", true).Delete(&Task{}).Error
}
