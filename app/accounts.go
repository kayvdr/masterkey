package app

import (
	"fmt"
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	"github.com/google/uuid"
	"github.com/on3k/shac-api/common"
	"github.com/on3k/shac-api/common/httperr"
	"github.com/on3k/shac-api/domain"
)

func (app Application) GetAccounts(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	pagination, err := common.NewPaginationFromURL(r.URL.Query())
	if err != nil {
		render.Render(w, r, httperr.ErrBadRequest(err.Error()))
		return
	}

	res, err := app.Repositories.Account.GetAllAccounts(ctx, pagination)
	if err != nil {
		render.Render(w, r, httperr.ErrInternalServer(err.Error()))
		return
	}

	count, _ := app.Repositories.Account.GetAccountsCount(ctx, pagination)

	var accounts []domain.FullAccounts
	for _, u := range res {
		accounts = append(accounts, domain.MapFullAccounts(u))
	} 

	type Response struct {
		Count int                 `json:"count"`
		Items     []domain.FullAccounts `json:"items"`
	}

	render.JSON(w, r, Response{Count: *count, Items: accounts})
}

func (app Application) GetAccount(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	param := chi.URLParam(r, "accountId")
	if param == "" {
		render.Render(w, r, httperr.ErrBadRequest("missing parameter 'accountId'"))
		return
	}
	accountId, err := uuid.Parse(param)
	if err != nil {
		render.Render(w, r, httperr.ErrBadRequest("invalid parameter accountId"))
		return
	}
	exists, errExists := app.Repositories.Account.ExistsAccount(ctx, accountId)
	if errExists != nil {
		render.Render(w, r, httperr.ErrInternalServer(errExists.Error()))
		return
	}
	if !exists {
		render.Render(w, r, httperr.ErrNotFound(fmt.Sprintf("account '%s' not found", accountId)))
		return
	}

	res, err := app.Repositories.Account.GetAccount(ctx, accountId)
	if err != nil {
		render.Render(w, r, httperr.ErrInternalServer(err.Error()))
		return
	}

	render.JSON(w, r, domain.MapAccount(res))
}

func (app Application) GetAccountVotes(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	param := chi.URLParam(r, "accountId")
	if param == "" {
		render.Render(w, r, httperr.ErrBadRequest("missing parameter 'accountId'"))
		return
	}
	accountId, err := uuid.Parse(param)
	if err != nil {
		render.Render(w, r, httperr.ErrBadRequest("invalid parameter accountId"))
		return
	}
	exists, errExists := app.Repositories.Account.ExistsAccount(ctx, accountId)
	if errExists != nil {
		render.Render(w, r, httperr.ErrInternalServer(errExists.Error()))
		return
	}
	if !exists {
		render.Render(w, r, httperr.ErrNotFound(fmt.Sprintf("account '%s' not found", accountId)))
		return
	}

	res, err := app.Repositories.Account.GetAccountVotes(ctx, accountId)
	if err != nil {
		render.Render(w, r, httperr.ErrInternalServer(err.Error()))
		return
	}

	var votes []domain.Vote
	for _, v := range res {
		votes = append(votes, domain.MapVote(v))
	} 

	render.JSON(w, r, votes)
}

func (app Application) CreateAccount(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	
	var body domain.CreateAccountBody
	if err := render.Bind(r, &body); err != nil {
		render.Render(w, r, httperr.ErrBadRequest(err.Error()))
		return
	}
	
	res, err := app.Repositories.Account.CreateAccount(ctx, body.Model())
	if err != nil {
		render.Render(w, r, httperr.ErrInternalServer(err.Error()))
		return
	}

	render.JSON(w, r, domain.MapAccount(res))
}

func (app Application) UpdateAccount(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	param := chi.URLParam(r, "accountId")
	if param == "" {
		render.Render(w, r, httperr.ErrBadRequest("missing parameter 'accountId'"))
		return
	}
	accountId, err := uuid.Parse(param)
	if err != nil {
		render.Render(w, r, httperr.ErrBadRequest("invalid parameter accountId"))
		return
	}
	
	var body domain.PatchAccountBody
	if err := render.Bind(r, &body); err != nil {
		render.Render(w, r, httperr.ErrBadRequest(err.Error()))
		return
	}

	exists, errExists := app.Repositories.Account.ExistsAccount(ctx, accountId)
	if errExists != nil {
		render.Render(w, r, httperr.ErrInternalServer(errExists.Error()))
		return
	}
	if !exists {
		render.Render(w, r, httperr.ErrNotFound(fmt.Sprintf("account '%s' not found", accountId)))
		return
	}
	
	res, err := app.Repositories.Account.UpdateAccount(ctx, body.Model(accountId))
	if err != nil {
		render.Render(w, r, httperr.ErrInternalServer(err.Error()))
		return
	}

	render.JSON(w, r, domain.MapAccount(res))
}

func (app Application) DeleteAccount(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	param := chi.URLParam(r, "accountId")
	if param == "" {
		render.Render(w, r, httperr.ErrBadRequest("missing parameter 'accountId'"))
		return
	}
	accountId, err := uuid.Parse(param)
	if err != nil {
		render.Render(w, r, httperr.ErrBadRequest("invalid parameter accountId"))
		return
	}

	exists, errExists := app.Repositories.Account.ExistsAccount(ctx, accountId)
	if errExists != nil {
		render.Render(w, r, httperr.ErrInternalServer(errExists.Error()))
		return
	}
	if !exists {
		render.Render(w, r, httperr.ErrNotFound(fmt.Sprintf("account '%s' not found", accountId)))
		return
	}

	_, err = app.Repositories.Account.DeleteAccount(ctx, accountId)
	if err != nil {
		render.Render(w, r, httperr.ErrInternalServer(err.Error()))
		return
	}

	render.NoContent(w, r)
}