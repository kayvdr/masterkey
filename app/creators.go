package app

import (
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	"github.com/google/uuid"
	"github.com/on3k/shac-api/common"
	"github.com/on3k/shac-api/common/httperr"
	"github.com/on3k/shac-api/domain"
)

func (app Application) GetCreatorsAccounts(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	param := chi.URLParam(r, "creatorId")
	if param == "" {
		render.Render(w, r, httperr.ErrBadRequest("missing parameter 'creatorId'"))
		return
	}
	creatorId, err := uuid.Parse(param)
	if err != nil {
		render.Render(w, r, httperr.ErrBadRequest("invalid parameter creatorId"))
		return
	}

	pagination, err := common.NewPaginationFromURL(r.URL.Query())
	if err != nil {
		render.Render(w, r, httperr.ErrBadRequest(err.Error()))
		return
	}

	res, err := app.Repositories.Account.GetAccountsByCreator(ctx, pagination, creatorId)
	if err != nil {
		render.Render(w, r, httperr.ErrInternalServer(err.Error()))
		return
	}

	var accounts []domain.Account
	for _, u := range res {
		accounts = append(accounts, domain.MapAccount(u))
	} 

	type Response struct {
		Count int                 `json:"count"`
		Items     []domain.Account `json:"items"`
	}

	render.JSON(w, r, Response{Count: len(accounts), Items: accounts})
}

func (app Application) GetCreatorsVotes(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	param := chi.URLParam(r, "creatorId")
	if param == "" {
		render.Render(w, r, httperr.ErrBadRequest("missing parameter 'creatorId'"))
		return
	}
	creatorId, err := uuid.Parse(param)
	if err != nil {
		render.Render(w, r, httperr.ErrBadRequest("invalid parameter creatorId"))
		return
	}

	pagination, err := common.NewPaginationFromURL(r.URL.Query())
	if err != nil {
		render.Render(w, r, httperr.ErrBadRequest(err.Error()))
		return
	}

	res, err := app.Repositories.Vote.GetVotesByCreator(ctx, pagination, creatorId)
	if err != nil {
		render.Render(w, r, httperr.ErrInternalServer(err.Error()))
		return
	}

	var votes []domain.FullVote
	for _, v := range res {
		votes = append(votes, domain.MapFullVote(v))
	} 

	type Response struct {
		Count int                 `json:"count"`
		Items     []domain.FullVote `json:"items"`
	}

	render.JSON(w, r, Response{Count: len(votes), Items: votes})
}
