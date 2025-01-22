package api

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/go-chi/render"
	"github.com/kayvdr/masterkey/common"
	"github.com/kayvdr/masterkey/common/httperror"
	"github.com/kayvdr/masterkey/domain"
	"github.com/kayvdr/masterkey/repositories"
)

func (app Application) GetAccounts(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	pagination, err := common.NewPaginationFromURL(r.URL.Query())
	if err != nil {
		app.HTTPError.New(w, r, httperror.New(http.StatusBadRequest, err))
		return
	}

	res, err := app.Repositories.Account.GetAccounts(ctx, pagination)
	if err != nil {
		app.HTTPError.New(w, r, err)
		return
	}

	total := 0

	if len(res) != 0 {
		total = res[0].FullCount
	}

	render.JSON(w, r, domain.NewAccountsResponse(res, total))
}

func (app Application) GetCreatorAccounts(w http.ResponseWriter, r *http.Request) {
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

	res, err := app.Repositories.Account.GetCreatorAccounts(ctx, pagination, creatorID)
	if err != nil {
		app.HTTPError.New(w, r, err)
		return
	}

	total := 0

	if len(res) != 0 {
		total = res[0].FullCount
	}

	render.JSON(w, r, domain.NewAccountsResponse(res, total))
}

func (app Application) GetCreatorAccountsVotes(w http.ResponseWriter, r *http.Request) {
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

	res, err := app.Repositories.Account.GetCreatorAccountsVotes(ctx, pagination, creatorID)
	if err != nil {
		app.HTTPError.New(w, r, err)
		return
	}

	total := 0

	if len(res) != 0 {
		total = res[0].FullCount
	}

	render.JSON(w, r, domain.NewAccountsResponse(res, total))
}

func (app Application) GetAccount(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	accountID, err := common.GetUUIDParamFromURL(r, "accountId")
	if err != nil {
		app.HTTPError.New(w, r, httperror.New(http.StatusBadRequest, err))
		return
	}

	res, err := app.Repositories.Account.GetAccount(ctx, accountID)
	if errors.Is(err, repositories.ErrAccountNotFound) {
		app.HTTPError.New(w, r, httperror.New(http.StatusNotFound, err))
		return
	}
	if err != nil {
		app.HTTPError.New(w, r, err)
		return
	}

	render.JSON(w, r, domain.NewAccount(*res))
}

func (app Application) GetCreatorAccount(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	accountID, err := common.GetUUIDParamFromURL(r, "accountId")
	if err != nil {
		app.HTTPError.New(w, r, httperror.New(http.StatusBadRequest, err))
		return
	}
	creatorID, err := common.GetUUIDParamFromURL(r, "creatorId")
	if err != nil {
		app.HTTPError.New(w, r, httperror.New(http.StatusBadRequest, err))
		return
	}

	res, err := app.Repositories.Account.GetCreatorAccount(ctx, creatorID, accountID)
	if errors.Is(err, repositories.ErrAccountNotFound) {
		app.HTTPError.New(w, r, httperror.New(http.StatusNotFound, err))
		return
	}
	if err != nil {
		app.HTTPError.New(w, r, err)
		return
	}

	render.JSON(w, r, domain.NewAccount(*res))
}

func (app Application) CreateAccount(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	token := r.Header.Get("X-Supabase-Auth")
	if err := app.Clients.SupabaseClient.GetUser(ctx, token); err != nil {
		app.HTTPError.New(w, r, httperror.New(http.StatusForbidden, err))
		return
	}

	var body domain.CreateAccountBody
	if err := render.Bind(r, &body); err != nil {
		app.HTTPError.New(w, r, httperror.New(http.StatusBadRequest, err))
		return
	}

	account, err := app.Repositories.Account.CreateAccount(ctx, body.Model())
	if err != nil {
		app.HTTPError.New(w, r, err)
		return
	}

	render.Status(r, http.StatusCreated)
	render.JSON(w, r, domain.NewAccount(*account))
}

func (app Application) UpdateAccount(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	token := r.Header.Get("X-Supabase-Auth")
	if err := app.Clients.SupabaseClient.GetUser(ctx, token); err != nil {
		app.HTTPError.New(w, r, httperror.New(http.StatusForbidden, err))
		return
	}

	accountID, err := common.GetUUIDParamFromURL(r, "accountId")
	if err != nil {
		app.HTTPError.New(w, r, httperror.New(http.StatusBadRequest, err))
		return
	}

	var body domain.PatchAccountBody
	if err := render.Bind(r, &body); err != nil {
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

	account, err := app.Repositories.Account.UpdateAccount(ctx, body.Model(), accountID)
	if err != nil {
		app.HTTPError.New(w, r, err)
		return
	}

	render.JSON(w, r, domain.NewAccount(*account))
}

func (app Application) DeleteAccount(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	token := r.Header.Get("X-Supabase-Auth")
	if err := app.Clients.SupabaseClient.GetUser(ctx, token); err != nil {
		app.HTTPError.New(w, r, httperror.New(http.StatusForbidden, err))
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

	_, err = app.Repositories.Account.DeleteAccount(ctx, accountID)
	if err != nil {
		app.HTTPError.New(w, r, err)
		return
	}

	render.NoContent(w, r)
}

func (app Application) ReportAccount(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	token := r.Header.Get("X-Supabase-Auth")
	if err := app.Clients.SupabaseClient.GetUser(ctx, token); err != nil {
		app.HTTPError.New(w, r, httperror.New(http.StatusForbidden, err))
		return
	}

	accountID, err := common.GetUUIDParamFromURL(r, "accountId")
	if err != nil {
		app.HTTPError.New(w, r, httperror.New(http.StatusBadRequest, err))
		return
	}
	creatorID, err := common.GetUUIDParamFromURL(r, "creatorId")
	if err != nil {
		app.HTTPError.New(w, r, httperror.New(http.StatusBadRequest, err))
		return
	}

	exists, err := app.Repositories.Report.ExistsReport(ctx, accountID, creatorID)
	if err != nil {
		app.HTTPError.New(w, r, err)
		return
	}
	if exists {
		app.HTTPError.New(w, r, httperror.New(http.StatusNotFound, fmt.Errorf("user already reported")))
		return
	}

	report, err := app.Repositories.Report.CreateAccountReport(ctx, accountID, creatorID)
	if err != nil {
		app.HTTPError.New(w, r, err)
		return
	}

	render.Status(r, http.StatusCreated)
	render.JSON(w, r, domain.NewReport(*report))
}
