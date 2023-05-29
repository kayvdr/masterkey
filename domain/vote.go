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
	CreatorId  uuid.UUID `json:"creator_id"`
}

func (b *VoteBody) Bind(r *http.Request) error {
	if b.Value != "up" && b.Value != "down" {
		return errors.New("value is not valid")
	}

	if b.UserId == uuid.Nil {
		return errors.New("user_id is required")
	}

	if b.CreatorId == uuid.Nil {
		return errors.New("creator_id is required")
	}

	return nil
}