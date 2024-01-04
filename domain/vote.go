package domain

import (
	"errors"
	"net/http"

	"github.com/google/uuid"
	"github.com/on3k/shac-api/repositories"
)

type Vote struct {
	Id         uuid.UUID `json:"id"`
	Value   string    `json:"value"`
	AccountId   uuid.UUID    `json:"accountId"`
	CreatorId  uuid.UUID `json:"creatorId"`
}

type FullVote struct {
	Id uuid.UUID `json:"id"`
	Value  string    `json:"value"`
	Username string `json:"username"`
	PlatformName string `json:"platformName"`
}

type CreateVoteBody struct {
	Id         uuid.UUID `json:"id"`
	Value   string    `json:"value"`
	AccountId   uuid.UUID    `json:"accountId"`
	CreatorId  uuid.UUID `json:"creatorId"`
}

func (b *CreateVoteBody) Bind(r *http.Request) error {
	if b.Value != "up" && b.Value != "down" {
		return errors.New("value is not valid")
	}

	if b.AccountId == uuid.Nil {
		return errors.New("accountId is required")
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
		AccountId: b.AccountId,
		CreatorId: b.CreatorId,
	}
}

func MapVote(dbItem *repositories.Vote) Vote {
	return Vote{
		Id: dbItem.Id,
		Value: dbItem.Value,
		AccountId: dbItem.AccountId,
		CreatorId: dbItem.CreatorId,
	}
}

func MapFullVote(dbItem *repositories.FullVote) FullVote {
	return FullVote{
		Id: dbItem.Id,
		Value: dbItem.Value,
		Username: dbItem.Username,
		PlatformName: dbItem.PlatformName,
	}
}