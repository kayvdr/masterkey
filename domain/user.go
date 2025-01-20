package domain

import (
	"errors"
	"net/http"

	"github.com/google/uuid"
	"github.com/kayvdr/masterkey/repositories"
)

type CreateUserBody struct {
	UserID uuid.UUID `json:"user_id"`
}

func (b *CreateUserBody) Bind(r *http.Request) error {
	if b.UserID == uuid.Nil {
		return errors.New("userId is required")
	}

	return nil
}

func (b *CreateUserBody) Model() repositories.User {
	return repositories.User{
		UserID: b.UserID,
	}
}
