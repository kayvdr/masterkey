package domain

import (
	"errors"
	"net/http"

	"github.com/google/uuid"
)

type UserIdBody struct {
	Id         uuid.UUID `json:"id"`
	Username   string    `json:"username"`
	Password   string    `json:"password"`
	PlatformId uuid.UUID `json:"platform_id"`
}

func (b *UserIdBody) Bind(r *http.Request) error {
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
		return errors.New("platform_id is required")
	}

	return nil
}