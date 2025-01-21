package api

import (
	"fmt"
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

	exists, err := app.Repositories.User.ExistsUser(ctx, body.Model().UserID)
	if err != nil {
		app.HTTPError.New(w, r, err)
		return
	}
	if exists {
		app.HTTPError.New(w, r, httperror.New(http.StatusNotFound, fmt.Errorf("deletion of user '%s' already in process", body.UserID)))
		return
	}

	_, err = app.Repositories.User.CreateDeleteRequest(ctx, body.Model().UserID)
	if err != nil {
		app.HTTPError.New(w, r, err)
		return
	}

	render.Status(r, http.StatusCreated)
	render.JSON(w, r, "")
}
