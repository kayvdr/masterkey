package app

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
	"github.com/google/uuid"
	"github.com/on3k/shac-api/common"
	"github.com/on3k/shac-api/common/httperr"
	"github.com/on3k/shac-api/repositories"
)

func (app Application) GetCreatorsUsers(w http.ResponseWriter, r *http.Request) {
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

	users, err := app.Repositories.User.GetUsersByCreator(ctx, pagination, creatorId)
	if err != nil {
		render.Render(w, r, httperr.ErrInternalServer(err.Error()))
		return
	}

	type Response struct {
		Count int                 `json:"count"`
		Items     []*repositories.FullUser `json:"items"`
	}

	render.JSON(w, r, Response{Count: len(users), Items: users})
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

	votes, err := app.Repositories.Vote.GetVotesByCreator(ctx, pagination, creatorId)
	if err != nil {
		render.Render(w, r, httperr.ErrInternalServer(err.Error()))
		return
	}

	type Response struct {
		Count int                 `json:"count"`
		Items     []*repositories.FullVote `json:"items"`
	}

	render.JSON(w, r, Response{Count: len(votes), Items: votes})
}
