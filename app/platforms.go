package app

import (
	"net/http"

	"github.com/go-chi/render"
	"github.com/google/uuid"
	"github.com/on3k/api-test/common/httperr"
)

type Platform struct {
	Id  uuid.UUID `json:"id"`
	Name   string      `json:"name"`
	Domain string    `json:"domain"`
}

func (app Application) GetPlatforms(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	platforms, err := app.Repositories.User.GetAllPlatforms(ctx)
	if err != nil {
		render.Render(w, r, httperr.ErrInternalServer(err.Error()))
		return
	}

	render.JSON(w, r, platforms)
}
