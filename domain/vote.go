package domain

import (
	"errors"
	"net/http"

	"github.com/google/uuid"
	"github.com/on3k/shac-api/common/slices"
	"github.com/on3k/shac-api/repositories"
)

type CreateVoteBody struct {
	Value   repositories.Value    `json:"value"`
	CreatorID  uuid.UUID `json:"creator_id"`
	AccountID   uuid.UUID    `json:"account_id"`
}

func (b *CreateVoteBody) Bind(r *http.Request) error {
	if b.Value != "up" && b.Value != "down" {
		return errors.New("value is not valid")
	}

	if b.AccountID == uuid.Nil {
		return errors.New("accountId is required")
	}

	if b.CreatorID == uuid.Nil {
		return errors.New("creatorId is required")
	}

	return nil
}

func (b *CreateVoteBody) Model() repositories.Vote {
	return repositories.Vote{
		Value: b.Value,
		AccountID: b.AccountID,
		CreatorID: b.CreatorID,
	}
}

type Vote struct {
	CreateVoteBody
	ID         uuid.UUID `json:"id"`
	Username string `json:"username"`
	PlatformName string `json:"platform_name"`
}

func NewVote(dbItem repositories.Vote) Vote {
	return Vote{
		CreateVoteBody: CreateVoteBody{
			Value: dbItem.Value,
			AccountID: dbItem.AccountID,
			CreatorID: dbItem.CreatorID,
		},
		ID: dbItem.ID,
		Username: dbItem.Username,
		PlatformName: dbItem.PlatformName,
	}
}

type VotesResponse struct {
	Total int    `json:"total"`
	Votes []Vote `json:"votes"`
}

func NewVotesResponse(votes []repositories.Vote, total int) VotesResponse {
	return VotesResponse{
		Total: total,
		Votes: slices.Map(votes, NewVote),
	}
}