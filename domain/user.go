package domain

import (
	"errors"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/on3k/shac-api/repositories"
)

type User struct {
	Id  uuid.UUID `json:"id"`
	Username   string      `json:"username"`
	Password string    `json:"password"`
	CreatedAt time.Time `json:"createdAt"`
	PlatformId uuid.UUID    `json:"platformId"`
	CreatorId uuid.UUID    `json:"creatorId"`
}

type CreateUserBody struct {
	Username   string    `json:"username"`
	Password   string    `json:"password"`
	PlatformId uuid.UUID `json:"platformId"`
	CreatorId  uuid.UUID `json:"creatorId"`
}

func (b *CreateUserBody) Bind(r *http.Request) error {
	if b.Username == "" {
		return errors.New("name is required")
	}

	if len(b.Username) > 60 {
		return errors.New("name is too long")
	}

	if len(b.Password) > 60 {
		return errors.New("password is too long")
	}

	if len(b.Password) < 8 {
		return errors.New("password is too short")
	}

	if b.PlatformId == uuid.Nil {
		return errors.New("platformId is required")
	}

	if b.CreatorId == uuid.Nil {
		return errors.New("creatorId is required")
	}

	return nil
}

func (b *CreateUserBody) Model() repositories.User {
	return repositories.User{
		Username: b.Username,
		Password: b.Password,
		CreatorId: b.CreatorId,
		PlatformId: b.PlatformId,
	}
}

type PatchUserBody struct {
	Id         uuid.UUID `json:"id"`
	Username   string    `json:"username"`
	Password   string    `json:"password"`
	PlatformId uuid.UUID `json:"platformId"`
}

func (b *PatchUserBody) Bind(r *http.Request) error {
	if b.Username == "" {
		return errors.New("name is required")
	}

	if len(b.Username) > 60 {
		return errors.New("name is too long")
	}

	if len(b.Password) > 60 {
		return errors.New("password is too long")
	}

	if len(b.Password) < 8 {
		return errors.New("password is too short")
	}

	if b.PlatformId == uuid.Nil {
		return errors.New("platformId is required")
	}

	return nil
}

func (b *PatchUserBody) Model(userId uuid.UUID) repositories.User {
	return repositories.User{
		Id: userId,
		Username: b.Username,
		Password: b.Password,
		PlatformId: b.PlatformId,
	}
}