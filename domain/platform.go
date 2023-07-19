package domain

import (
	"github.com/google/uuid"
	"github.com/on3k/shac-api/repositories"
)

type Platform struct {
	Id         uuid.UUID `json:"id"`
	Name   string    `json:"name"`
	URL   string    `json:"url"`
}

func MapPlatform(dbItem *repositories.Platform) Platform {
	return Platform{
		Id: dbItem.Id,
		Name: dbItem.Name,
		URL: dbItem.URL,
	}
}