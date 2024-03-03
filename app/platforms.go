package app

import (
	"net/http"

	"github.com/go-chi/render"
	"github.com/on3k/shac-api/common/httperr"
	"github.com/on3k/shac-api/domain"
)

func (app Application) GetPlatforms(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	res, err := app.Repositories.Platform.GetPlatforms(ctx)
	if err != nil {
		render.Render(w, r, httperr.ErrInternalServer(err.Error()))
		return
	}

	render.JSON(w, r, domain.NewPlatformsResponse(res))
}
