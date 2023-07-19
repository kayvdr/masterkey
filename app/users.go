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

func (app Application) GetUsers(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	pagination, err := common.NewPaginationFromURL(r.URL.Query())
	if err != nil {
		render.Render(w, r, httperr.ErrBadRequest(err.Error()))
		return
	}

	res, err := app.Repositories.User.GetAllUsers(ctx, pagination)
	if err != nil {
		render.Render(w, r, httperr.ErrInternalServer(err.Error()))
		return
	}

	count, _ := app.Repositories.User.GetUsersCount(ctx, pagination)

	var users []domain.FullUser
	for _, u := range res {
		users = append(users, domain.MapFullUser(u))
	} 

	type Response struct {
		Count int                 `json:"count"`
		Items     []domain.FullUser `json:"items"`
	}

	render.JSON(w, r, Response{Count: *count, Items: users})
}

func (app Application) GetUser(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	param := chi.URLParam(r, "userId")
	if param == "" {
		render.Render(w, r, httperr.ErrBadRequest("missing parameter 'userId'"))
		return
	}
	userId, err := uuid.Parse(param)
	if err != nil {
		render.Render(w, r, httperr.ErrBadRequest("invalid parameter userId"))
		return
	}
	exists, errExists := app.Repositories.User.ExistsUser(ctx, userId)
	if errExists != nil {
		render.Render(w, r, httperr.ErrInternalServer(errExists.Error()))
		return
	}
	if !exists {
		render.Render(w, r, httperr.ErrNotFound(fmt.Sprintf("user '%s' not found", userId)))
		return
	}

	res, err := app.Repositories.User.GetUser(ctx, userId)
	if err != nil {
		render.Render(w, r, httperr.ErrInternalServer(err.Error()))
		return
	}

	render.JSON(w, r, domain.MapUser(res))
}

func (app Application) GetUserVotes(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	param := chi.URLParam(r, "userId")
	if param == "" {
		render.Render(w, r, httperr.ErrBadRequest("missing parameter 'userId'"))
		return
	}
	userId, err := uuid.Parse(param)
	if err != nil {
		render.Render(w, r, httperr.ErrBadRequest("invalid parameter userId"))
		return
	}
	exists, errExists := app.Repositories.User.ExistsUser(ctx, userId)
	if errExists != nil {
		render.Render(w, r, httperr.ErrInternalServer(errExists.Error()))
		return
	}
	if !exists {
		render.Render(w, r, httperr.ErrNotFound(fmt.Sprintf("user '%s' not found", userId)))
		return
	}

	res, err := app.Repositories.User.GetUserVotes(ctx, userId)
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

func (app Application) CreateUser(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	
	var body domain.CreateUserBody
	if err := render.Bind(r, &body); err != nil {
		render.Render(w, r, httperr.ErrBadRequest(err.Error()))
		return
	}
	
	res, err := app.Repositories.User.CreateUser(ctx, body.Model())
	if err != nil {
		render.Render(w, r, httperr.ErrInternalServer(err.Error()))
		return
	}

	render.JSON(w, r, domain.MapUser(res))
}

func (app Application) UpdateUser(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	param := chi.URLParam(r, "userId")
	if param == "" {
		render.Render(w, r, httperr.ErrBadRequest("missing parameter 'userId'"))
		return
	}
	userId, err := uuid.Parse(param)
	if err != nil {
		render.Render(w, r, httperr.ErrBadRequest("invalid parameter userId"))
		return
	}
	
	var body domain.PatchUserBody
	if err := render.Bind(r, &body); err != nil {
		render.Render(w, r, httperr.ErrBadRequest(err.Error()))
		return
	}

	exists, errExists := app.Repositories.User.ExistsUser(ctx, userId)
	if errExists != nil {
		render.Render(w, r, httperr.ErrInternalServer(errExists.Error()))
		return
	}
	if !exists {
		render.Render(w, r, httperr.ErrNotFound(fmt.Sprintf("user '%s' not found", userId)))
		return
	}
	
	res, err := app.Repositories.User.UpdateUser(ctx, body.Model(userId))
	if err != nil {
		render.Render(w, r, httperr.ErrInternalServer(err.Error()))
		return
	}

	render.JSON(w, r, domain.MapUser(res))
}

func (app Application) DeleteUser(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	param := chi.URLParam(r, "userId")
	if param == "" {
		render.Render(w, r, httperr.ErrBadRequest("missing parameter 'userId'"))
		return
	}
	userId, err := uuid.Parse(param)
	if err != nil {
		render.Render(w, r, httperr.ErrBadRequest("invalid parameter userId"))
		return
	}

	exists, errExists := app.Repositories.User.ExistsUser(ctx, userId)
	if errExists != nil {
		render.Render(w, r, httperr.ErrInternalServer(errExists.Error()))
		return
	}
	if !exists {
		render.Render(w, r, httperr.ErrNotFound(fmt.Sprintf("user '%s' not found", userId)))
		return
	}

	_, err = app.Repositories.User.DeleteUser(ctx, userId)
	if err != nil {
		render.Render(w, r, httperr.ErrInternalServer(err.Error()))
		return
	}

	render.NoContent(w, r)
}