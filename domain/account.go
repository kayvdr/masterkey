package domain

import (
	"errors"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/on3k/shac-api/repositories"
)

type Account struct {
	Id  uuid.UUID `json:"id"`
	Username   string      `json:"username"`
	Password string    `json:"password"`
	CreatedAt time.Time `json:"createdAt"`
	CreatorId uuid.UUID    `json:"creatorId"`
	VotesUp int `json:"votesUp"`
	VotesDown int `json:"votesDown"`
	Platform Platform `json:"platform"`
}

type CreateAccountBody struct {
	Username   string    `json:"username"`
	Password   string    `json:"password"`
	PlatformId uuid.UUID `json:"platformId"`
	CreatorId  uuid.UUID `json:"creatorId"`
}

func (b *CreateAccountBody) Bind(r *http.Request) error {
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

func (b *CreateAccountBody) Model() repositories.Account {
	return repositories.Account{
		Username: b.Username,
		Password: b.Password,
		CreatorId: b.CreatorId,
		Platform: repositories.Platform{Id: b.PlatformId},
	}
}

type PatchAccountBody struct {
	Id         uuid.UUID `json:"id"`
	Username   string    `json:"username"`
	Password   string    `json:"password"`
	PlatformId uuid.UUID `json:"platformId"`
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

	if b.PlatformId == uuid.Nil {
		return errors.New("platformId is required")
	}

	return nil
}

func (b *PatchAccountBody) Model(accountId uuid.UUID) repositories.Account {
	return repositories.Account{
		Id: accountId,
		Username: b.Username,
		Password: b.Password,
		Platform: repositories.Platform{Id: b.PlatformId},
	}
}

func MapAccount(dbItem *repositories.Account) Account {
	return Account{
		Id: dbItem.Id,
		Username: dbItem.Username,
		Password: dbItem.Password,
		VotesUp: *dbItem.VotesUp,
		VotesDown: *dbItem.VotesDown,
		CreatedAt: dbItem.CreatedAt,
		Platform: Platform{
			Id: dbItem.Platform.Id, 
			Name: dbItem.Platform.Name,
			URL: dbItem.Platform.URL,
		},
		CreatorId: dbItem.CreatorId,
	}
}