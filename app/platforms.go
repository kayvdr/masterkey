package app

import (
	"net/http"

	"github.com/go-chi/render"
	"github.com/on3k/shac-api/common/httperr"
)

func (app Application) GetPlatforms(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	platforms, err := app.Repositories.Platform.GetAllPlatforms(ctx)
	if err != nil {
		render.Render(w, r, httperr.ErrInternalServer(err.Error()))
		return
	}

	render.JSON(w, r, platforms)
}
