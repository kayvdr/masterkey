package app

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/go-chi/render"
	"github.com/on3k/shac-api/common"
	"github.com/on3k/shac-api/common/httperr"
	"github.com/on3k/shac-api/domain"
	"github.com/on3k/shac-api/repositories"
)

func (app Application) GetAccounts(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	pagination, err := common.NewPaginationFromURL(r.URL.Query())
	if err != nil {
		render.Render(w, r, httperr.ErrBadRequest(err.Error()))
		return
	}

	res, err := app.Repositories.Account.GetAccounts(ctx, pagination)
	if err != nil {
		render.Render(w, r, httperr.ErrInternalServer(err.Error()))
		return
	}

	count, err := app.Repositories.Account.GetAccountsCount(ctx, pagination)
	if err != nil {
		render.Render(w, r, httperr.ErrInternalServer(err.Error()))
		return
	}

	
	render.JSON(w, r, domain.NewAccountsResponse(res, count))
}

func (app Application) GetAccount(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	accountID, err := common.GetUUIDParamFromURL(r, "accountId")
	if err != nil {
		render.Render(w, r, httperr.ErrBadRequest(err.Error()))
		return
	}

	res, err := app.Repositories.Account.GetAccount(ctx, accountID)
	if errors.Is(err, repositories.ErrAccountNotFound) {
		render.Render(w, r, httperr.ErrNotFound(err.Error()))
		return
	}
	if err != nil {
		render.Render(w, r, httperr.ErrInternalServer(err.Error()))
		return
	}

	render.JSON(w, r, domain.NewAccount(*res))
}

func (app Application) GetAccountVotes(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	accountID, err := common.GetUUIDParamFromURL(r, "accountId")
	if err != nil {
		render.Render(w, r, httperr.ErrBadRequest(err.Error()))
		return
	}

	exists, err := app.Repositories.Account.ExistsAccount(ctx, accountID)
	if err != nil {
		render.Render(w, r, httperr.ErrInternalServer(err.Error()))
		return
	}
	if !exists {
		render.Render(w, r, httperr.ErrNotFound(fmt.Sprintf("account '%s' not found", accountID)))
		return
	}

	res, err := app.Repositories.Account.GetAccountVotes(ctx, accountID)
	if err != nil {
		render.Render(w, r, httperr.ErrInternalServer(err.Error()))
		return
	}

	render.JSON(w, r, domain.NewVotesResponse(res, len(res)))
}

func (app Application) CreateAccount(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	
	var body domain.CreateAccountBody
	if err := render.Bind(r, &body); err != nil {
		render.Render(w, r, httperr.ErrBadRequest(err.Error()))
		return
	}
	
	account, err := app.Repositories.Account.CreateAccount(ctx, body.Model())
	if err != nil {
		render.Render(w, r, httperr.ErrInternalServer(err.Error()))
		return
	}

	render.Status(r, http.StatusCreated)
	render.JSON(w, r, domain.NewAccount(*account))
}

func (app Application) UpdateAccount(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	accountID, err := common.GetUUIDParamFromURL(r, "accountId")
	if err != nil {
		render.Render(w, r, httperr.ErrBadRequest(err.Error()))
		return
	}

	var body domain.PatchAccountBody
	if err := render.Bind(r, &body); err != nil {
		render.Render(w, r, httperr.ErrBadRequest(err.Error()))
		return
	}

	exists, err := app.Repositories.Account.ExistsAccount(ctx, accountID)
	if err != nil {
		render.Render(w, r, httperr.ErrInternalServer(err.Error()))
		return
	}
	if !exists {
		render.Render(w, r, httperr.ErrNotFound(fmt.Sprintf("account '%s' not found", accountID)))
		return
	}
	
	account, err := app.Repositories.Account.UpdateAccount(ctx, body.Model(), accountID)
	if err != nil {
		render.Render(w, r, httperr.ErrInternalServer(err.Error()))
		return
	}

	render.JSON(w, r, domain.NewAccount(*account))
}

func (app Application) DeleteAccount(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	accountID, err := common.GetUUIDParamFromURL(r, "accountId")
	if err != nil {
		render.Render(w, r, httperr.ErrBadRequest("invalid parameter accountId"))
		return
	}

	exists, err := app.Repositories.Account.ExistsAccount(ctx, accountID)
	if err != nil {
		render.Render(w, r, httperr.ErrInternalServer(err.Error()))
		return
	}
	if !exists {
		render.Render(w, r, httperr.ErrNotFound(fmt.Sprintf("account '%s' not found", accountID)))
		return
	}

	_, err = app.Repositories.Account.DeleteAccount(ctx, accountID)
	if err != nil {
		render.Render(w, r, httperr.ErrInternalServer(err.Error()))
		return
	}

	render.NoContent(w, r)
}