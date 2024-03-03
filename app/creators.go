package app

import (
	"net/http"

	"github.com/go-chi/render"
	"github.com/on3k/shac-api/common"
	"github.com/on3k/shac-api/common/httperr"
	"github.com/on3k/shac-api/domain"
)

func (app Application) GetCreatorsAccounts(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	creatorID, err := common.GetUUIDParamFromURL(r, "creatorId")
	if err != nil {
		render.Render(w, r, httperr.ErrBadRequest(err.Error()))
		return
	}

	pagination, err := common.NewPaginationFromURL(r.URL.Query())
	if err != nil {
		render.Render(w, r, httperr.ErrBadRequest(err.Error()))
		return
	}

	res, err := app.Repositories.Account.GetAccountsByCreator(ctx, pagination, creatorID)
	if err != nil {
		render.Render(w, r, httperr.ErrInternalServer(err.Error()))
		return
	}

	var accounts []domain.Account
	for _, u := range res {
		accounts = append(accounts, domain.NewAccount(u))
	} 

	type Response struct {
		Count int                 `json:"count"`
		Items     []domain.Account `json:"items"`
	}

	render.JSON(w, r, Response{Count: len(accounts), Items: accounts})
}

func (app Application) GetCreatorsVotes(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	creatorID, err := common.GetUUIDParamFromURL(r, "creatorId")
	if err != nil {
		render.Render(w, r, httperr.ErrBadRequest(err.Error()))
		return
	}

	pagination, err := common.NewPaginationFromURL(r.URL.Query())
	if err != nil {
		render.Render(w, r, httperr.ErrBadRequest(err.Error()))
		return
	}

	res, err := app.Repositories.Vote.GetVotesByCreator(ctx, pagination, creatorID)
	if err != nil {
		render.Render(w, r, httperr.ErrInternalServer(err.Error()))
		return
	}

	render.JSON(w, r,  domain.NewVotesResponse(res, len(res)))
}
