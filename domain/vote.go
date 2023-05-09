package domain

import (
	"errors"
	"net/http"

	"github.com/google/uuid"
)

type VoteBody struct {
	Id         uuid.UUID `json:"id"`
	Value   string    `json:"value"`
	UserId   uuid.UUID    `json:"user_id"`
	CreatedBy  uuid.UUID `json:"created_by"`
}

func (b *VoteBody) Bind(r *http.Request) error {
	if b.Value != "up" && b.Value != "down" {
		return errors.New("value is not valid")
	}

	return nil
}