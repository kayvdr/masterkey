package domain

import (
	"errors"
	"net/http"

	"github.com/google/uuid"
)

type UserBody struct {
	Id         uuid.UUID `json:"id"`
	Username   string    `json:"username"`
	Password   string    `json:"password"`
	VotesUp    *int      `json:"votes_up"`
	VotesDown  *int      `json:"votes_down"`
	PlatformId uuid.UUID `json:"platform_id"`
	CreatedBy  uuid.UUID `json:"created_by"`
}

func (b *UserBody) Bind(r *http.Request) error {
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

	return nil
}