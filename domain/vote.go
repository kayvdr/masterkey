package domain

import (
	"errors"
	"net/http"

	"github.com/google/uuid"
	"github.com/on3k/shac-api/repositories"
)

type CreateVoteBody struct {
	Id         uuid.UUID `json:"id"`
	Value   string    `json:"value"`
	UserId   uuid.UUID    `json:"userId"`
	CreatorId  uuid.UUID `json:"creatorId"`
}

func (b *CreateVoteBody) Bind(r *http.Request) error {
	if b.Value != "up" && b.Value != "down" {
		return errors.New("value is not valid")
	}

	if b.UserId == uuid.Nil {
		return errors.New("userId is required")
	}

	if b.CreatorId == uuid.Nil {
		return errors.New("creatorId is required")
	}

	return nil
}

func (b *CreateVoteBody) Model() repositories.Vote {
	return repositories.Vote{
		Id: b.Id,
		Value: b.Value,
		UserId: b.UserId,
		CreatorId: b.CreatorId,
	}
}