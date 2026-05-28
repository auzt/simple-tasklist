package task

import (
	"context"
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) AutoMigrate() error {
	return s.repo.AutoMigrate()
}

func (s *Service) GetAllTasks(ctx context.Context) ([]Task, error) {
	return s.repo.FindAll(ctx)
}

func (s *Service) CreateTask(ctx context.Context, dto CreateTaskDTO) (*Task, error) {
	task := &Task{
		Title:     dto.Title,
		Completed: false,
	}
	err := s.repo.Create(ctx, task)
	return task, err
}

func (s *Service) UpdateTask(ctx context.Context, id uint, dto UpdateTaskDTO) (*Task, error) {
	task, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}

	if dto.Title != nil {
		task.Title = *dto.Title
	}
	if dto.Completed != nil {
		task.Completed = *dto.Completed
	}

	err = s.repo.Update(ctx, task)
	return task, err
}

func (s *Service) DeleteTask(ctx context.Context, id uint) error {
	return s.repo.Delete(ctx, id)
}

func (s *Service) DeleteCompletedTasks(ctx context.Context) error {
	return s.repo.DeleteCompleted(ctx)
}
