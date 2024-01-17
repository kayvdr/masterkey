package app

import (
	"fmt"
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	"github.com/google/uuid"
	"github.com/on3k/shac-api/common/httperr"
	"github.com/on3k/shac-api/domain"
	"github.com/on3k/shac-api/repositories"
)

func (app Application) CreateVote(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	
	var body domain.CreateVoteBody
	if err := render.Bind(r, &body); err != nil {
		render.Render(w, r, httperr.ErrBadRequest(err.Error()))
		return
	}

	exists, err := app.Repositories.Account.ExistsAccount(ctx, body.AccountId)
	if err != nil {
		render.Render(w, r, httperr.ErrInternalServer(err.Error()))
		return
	}
	if !exists {
		render.Render(w, r, httperr.ErrNotFound(fmt.Sprintf("account '%s' not found", body.AccountId)))
		return
	}

	res, err := app.Repositories.Vote.CreateVote(ctx, body.Model())
	if err == repositories.ErrMultipleVotes {
		render.Render(w, r, httperr.ErrBadRequest(err.Error()))
		return
	}
	if err != nil {
		render.Render(w, r, httperr.ErrInternalServer(err.Error()))
		return
	}

	render.JSON(w, r, domain.MapVote(res))
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

	exists, err := app.Repositories.Vote.ExistsVote(ctx, voteId)
	if err != nil {
		render.Render(w, r, httperr.ErrInternalServer(err.Error()))
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
