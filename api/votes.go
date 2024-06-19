package api

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	"github.com/google/uuid"
	"github.com/on3k/shac-api/common"
	"github.com/on3k/shac-api/common/httperror"
	"github.com/on3k/shac-api/domain"
	"github.com/on3k/shac-api/repositories"
)

func (app Application) GetCreatorAccountVote(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	creatorID, err := common.GetUUIDParamFromURL(r, "creatorId")
	if err != nil {
		app.HTTPError.New(w, r, httperror.New(http.StatusBadRequest, err))
		return
	}
	accountID, err := common.GetUUIDParamFromURL(r, "accountId")
	if err != nil {
		app.HTTPError.New(w, r, httperror.New(http.StatusBadRequest, err))
		return
	}

	exists, err := app.Repositories.Account.ExistsAccount(ctx, accountID)
	if err != nil {
		app.HTTPError.New(w, r, err)
		return
	}
	if !exists {
		app.HTTPError.New(w, r, httperror.New(http.StatusNotFound, fmt.Errorf("account '%s' not found", accountID)))
		return
	}

	res, err := app.Repositories.Vote.GetAccountVotes(ctx, accountID, creatorID)
	if err != nil {
		app.HTTPError.New(w, r, err)
		return
	}
	if res == nil {
		return
	}

	render.JSON(w, r, domain.NewVote(*res))
}

func (app Application) CreateVote(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	token := r.Header.Get("X-Supabase-Auth")
	if err := app.Clients.SupabaseClient.GetUser(ctx, token); err != nil {
		app.HTTPError.New(w, r, httperror.New(http.StatusForbidden, err))
		return
	}
	
	var body domain.CreateVoteBody
	if err := render.Bind(r, &body); err != nil {
		app.HTTPError.New(w, r, httperror.New(http.StatusBadRequest, err))
		return
	}

	res, err := app.Repositories.Vote.CreateVote(ctx, body.Model())
	if err == repositories.ErrMultipleVotes {
		app.HTTPError.New(w, r, httperror.New(http.StatusBadRequest, err))
		return
	}
	if err != nil {
		app.HTTPError.New(w, r, err)
		return
	}

	render.Status(r, http.StatusCreated)
	render.JSON(w, r, domain.NewVote(*res))
}

func (app Application) DeleteVote(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	token := r.Header.Get("X-Supabase-Auth")
	if err := app.Clients.SupabaseClient.GetUser(ctx, token); err != nil {
		app.HTTPError.New(w, r, httperror.New(http.StatusForbidden, err))
		return
	}
	
	param := chi.URLParam(r, "voteId")
	if param == "" {
		app.HTTPError.New(w, r, httperror.New(http.StatusBadRequest, errors.New("missing parameter 'voteId'")))
		return
	}
	voteId, err := uuid.Parse(param)
	if err != nil {
		app.HTTPError.New(w, r, httperror.New(http.StatusBadRequest, errors.New("invalid parameter 'voteId'")))
		return
	}

	exists, err := app.Repositories.Vote.ExistsVote(ctx, voteId)
	if err != nil {
		app.HTTPError.New(w, r, err)
		return
	}
	if !exists {
		app.HTTPError.New(w, r, httperror.New(http.StatusNotFound, fmt.Errorf("vote '%s' not found", voteId)))
		return
	}

	_, err = app.Repositories.Vote.DeleteVote(ctx, voteId)
	if err != nil {
		app.HTTPError.New(w, r, err)
		return
	}

	render.NoContent(w, r)
}
