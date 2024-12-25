package api

import (
	"net/http"

	"github.com/go-chi/render"
	"github.com/kayvdr/shac/domain"
)

func (app Application) GetPlatforms(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	res, err := app.Repositories.Platform.GetPlatforms(ctx)
	if err != nil {
		app.HTTPError.New(w, r, err)
		return
	}

	render.JSON(w, r, domain.NewPlatformsResponse(res))
}
