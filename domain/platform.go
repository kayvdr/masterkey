package domain

import (
	"github.com/google/uuid"
	"github.com/kayvdr/masterkey/common/slices"
	"github.com/kayvdr/masterkey/repositories"
)

type Platform struct {
	ID   uuid.UUID `json:"id"`
	Name string    `json:"name"`
	URL  string    `json:"url"`
}

func NewPlatform(dbItem repositories.Platform) Platform {
	return Platform{
		ID:   dbItem.ID,
		Name: dbItem.Name,
		URL:  dbItem.URL,
	}
}

type PlatformsResponse struct {
	Platforms []Platform `json:"platforms"`
}

func NewPlatformsResponse(platforms []repositories.Platform) PlatformsResponse {
	return PlatformsResponse{
		Platforms: slices.Map(platforms, NewPlatform),
	}
}
