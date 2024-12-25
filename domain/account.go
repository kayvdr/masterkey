package domain

import (
	"errors"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/kayvdr/shac/common/slices"
	"github.com/kayvdr/shac/repositories"
)

type PatchAccountBody struct {
	Username   string    `json:"username"`
	Password   string    `json:"password"`
	PlatformID uuid.UUID `json:"platform_id"`
}

func (b *PatchAccountBody) Bind(r *http.Request) error {
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

	if b.PlatformID == uuid.Nil {
		return errors.New("platformId is required")
	}

	return nil
}

func (b *PatchAccountBody) Model() repositories.Account {
	return repositories.Account{
		Username: b.Username,
		Password: b.Password,
		PlatformID: b.PlatformID,
	}
}

type CreateAccountBody struct {
	CreatorID  uuid.UUID `json:"creator_id"`
	PatchAccountBody
}

func (b *CreateAccountBody) Bind(r *http.Request) error {
	if err := b.PatchAccountBody.Bind(r); err != nil {
		return err
	}

	if b.CreatorID == uuid.Nil {
		return errors.New("creatorId is required")
	}

	return nil
}

func (b *CreateAccountBody) Model() repositories.Account {
	return repositories.Account{
		Username: b.Username,
		Password: b.Password,
		CreatorID: b.CreatorID,
		PlatformID: b.PlatformID,
	}
}

type Account struct {
	ID  uuid.UUID `json:"id"`
	CreatedAt time.Time `json:"created_at"`
	VotesUp int `json:"votes_up"`
	VotesDown int `json:"votes_down"`
	PlatformName   string    `json:"platform_name"`
	PlatformURL   string    `json:"platform_url"`
	CreateAccountBody
}

func NewAccount(dbItem repositories.Account) Account {
	return Account{
		ID: dbItem.ID,
		VotesUp: dbItem.VotesUp,
		VotesDown: dbItem.VotesDown,
		CreatedAt: dbItem.CreatedAt,
		PlatformName: dbItem.PlatformName,
		PlatformURL: dbItem.PlatformURL,
		CreateAccountBody: CreateAccountBody{
			CreatorID: dbItem.CreatorID, 
			PatchAccountBody: PatchAccountBody{
				Username: dbItem.Username, 
				Password: dbItem.Password,
				PlatformID: dbItem.PlatformID,
			},
		},
	}
}

type AccountsResponse struct {
	Total    int       `json:"total"`
	Accounts []Account `json:"accounts"`
}

func NewAccountsResponse(accounts []repositories.Account, total int) AccountsResponse {
	return AccountsResponse{
		Total: total,
		Accounts: slices.Map(accounts, NewAccount),
	}
}