package api

import (
	"net/http"

	"github.com/go-chi/render"
	"github.com/on3k/shac-api/common"
	"github.com/on3k/shac-api/common/httperror"
	"github.com/on3k/shac-api/domain"
)

func (app Application) GetCreatorsAccounts(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	creatorID, err := common.GetUUIDParamFromURL(r, "creatorId")
	if err != nil {
		app.HTTPError.New(w, r, httperror.New(http.StatusBadRequest, err))
		return
	}

	pagination, err := common.NewPaginationFromURL(r.URL.Query())
	if err != nil {
		app.HTTPError.New(w, r, httperror.New(http.StatusBadRequest, err))
		return
	}

	res, err := app.Repositories.Account.GetAccountsByCreator(ctx, pagination, creatorID)
	if err != nil {
		app.HTTPError.New(w, r, err)
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
		app.HTTPError.New(w, r, httperror.New(http.StatusBadRequest, err))
		return
	}

	pagination, err := common.NewPaginationFromURL(r.URL.Query())
	if err != nil {
		app.HTTPError.New(w, r, httperror.New(http.StatusBadRequest, err))
		return
	}

	res, err := app.Repositories.Vote.GetVotesByCreator(ctx, pagination, creatorID)
	if err != nil {
		app.HTTPError.New(w, r, err)
		return
	}

	render.JSON(w, r,  domain.NewVotesResponse(res, len(res)))
}
