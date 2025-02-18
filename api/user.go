package api

import (
	"fmt"
	"log"
	"net/http"

	"github.com/go-chi/render"
	"github.com/kayvdr/masterkey/common"
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
		app.HTTPError.New(w, r, httperror.New(http.StatusBadRequest, fmt.Errorf("deletion of user '%s' already in process", body.UserID)))
		return
	}

	pagination, err := common.NewPaginationFromURL(r.URL.Query())
	if err != nil {
		app.HTTPError.New(w, r, httperror.New(http.StatusBadRequest, err))
		return
	}

	votes, err := app.Repositories.Vote.GetCreatorVotes(ctx, body.Model().UserID)
	if err != nil {
		app.HTTPError.New(w, r, err)
		return
	}

	for _, vote := range votes {
		_, err := app.Repositories.Vote.DeleteVote(ctx, vote.ID)
		log.Println(err)
	}

	accounts, err := app.Repositories.Account.GetCreatorAccounts(ctx, pagination, body.Model().UserID)
	if err != nil {
		app.HTTPError.New(w, r, err)
		return
	}

	for _, account := range accounts {
		app.Repositories.Account.DeleteAccount(ctx, account.ID)
	}

	_, err = app.Repositories.User.CreateDeleteRequest(ctx, body.Model().UserID)
	if err != nil {
		app.HTTPError.New(w, r, err)
		return
	}

	render.Status(r, http.StatusCreated)
	render.JSON(w, r, "")
}
