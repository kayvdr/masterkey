package api

import (
	"net/http"

	"github.com/go-chi/render"
	"github.com/kayvdr/masterkey/common/httperror"
	"github.com/kayvdr/masterkey/domain"
)

func (app Application) DeleteRequest(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var body domain.CreateUserBody
	if err := render.Bind(r, &body); err != nil {
		app.HTTPError.New(w, r, httperror.New(http.StatusBadRequest, err))
		return
	}

	_, err := app.Repositories.User.CreateDeleteRequest(ctx, body.Model())
	if err != nil {
		app.HTTPError.New(w, r, err)
		return
	}


	render.Status(r, http.StatusCreated)
}
