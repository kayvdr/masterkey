package app

import (
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
	"github.com/google/uuid"
	"github.com/on3k/shac-api/common/httperr"
	"github.com/on3k/shac-api/domain"
	"github.com/on3k/shac-api/repositories"
)

type Vote struct {
	Id  uuid.UUID `json:"id"`
	Value   string      `json:"value"`
	UserId uuid.UUID    `json:"user_id"`
	CreatorId uuid.UUID    `json:"creator_id"`
}

func (app Application) CreateVote(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	
	var body domain.VoteBody
	if err := render.Bind(r, &body); err != nil {
		render.Render(w, r, httperr.ErrBadRequest(err.Error()))
		return
	}

	vote := repositories.Vote{
		Value: body.Value,
		UserId: body.UserId,
		CreatorId: body.CreatorId,
	}

	exists, errExists := app.Repositories.User.ExistsUser(ctx, vote.UserId)
	if errExists != nil {
		render.Render(w, r, httperr.ErrInternalServer(errExists.Error()))
		return
	}
	if !exists {
		render.Render(w, r, httperr.ErrNotFound(fmt.Sprintf("user '%s' not found", vote.UserId)))
		return
	}

	res, err := app.Repositories.Vote.CreateVote(ctx, vote)
	if err == repositories.ErrMultipleVotes {
		render.Render(w, r, httperr.ErrBadRequest(err.Error()))
		return
	}
	if err != nil {
		render.Render(w, r, httperr.ErrInternalServer(err.Error()))
		return
	}

	render.JSON(w, r, res)
}

func (app Application) DeleteVote(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	param := chi.URLParam(r, "voteId")
	if param == "" {
		render.Render(w, r, httperr.ErrBadRequest("missing parameter 'voteId'"))
		return
	}
	voteId, err := uuid.Parse(param)
	if err != nil {
		render.Render(w, r, httperr.ErrBadRequest("invalid parameter voteId"))
		return
	}

	exists, errExists := app.Repositories.Vote.ExistsVote(ctx, voteId)
	if errExists != nil {
		render.Render(w, r, httperr.ErrInternalServer(errExists.Error()))
		return
	}
	if !exists {
		render.Render(w, r, httperr.ErrNotFound(fmt.Sprintf("vote '%s' not found", voteId)))
		return
	}

	_, err = app.Repositories.Vote.DeleteVote(ctx, voteId)
	if err != nil {
		render.Render(w, r, httperr.ErrInternalServer(err.Error()))
		return
	}

	render.NoContent(w, r)
}
