package api

import (
	"context"
	"net/http"

	"github.com/go-chi/chi"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/on3k/shac-api/clients/supabase"
	"github.com/on3k/shac-api/common/env"
	"github.com/on3k/shac-api/common/httperror"
	"github.com/on3k/shac-api/common/middleware"
	"github.com/on3k/shac-api/repositories"
	"github.com/shopspring/decimal"
)

type Application struct {
	Clients      Clients
	Repositories Repositories
	HTTPError    httperror.Client
	env          *env.Env
}

type Repositories struct {
	Account repositories.AccountRepository
	Vote repositories.VoteRepository
	Platform repositories.PlatformRepository
	
}

type Clients struct {
	Pool          *pgxpool.Pool
	SupabaseClient supabase.Client
}

func NewApplication(ctx context.Context, env *env.Env) (*Application, error) {
	pool, err := pgxpool.New(ctx, env.DbUrl)
	if err != nil {
		return nil, err
	}

	supabaseClient, err := supabase.NewClient(env)
	if err != nil {
		return nil, err
	}

	decimal.MarshalJSONWithoutQuotes = true

	return &Application{
		Clients: Clients{
			Pool:          pool,
			SupabaseClient: *supabaseClient,
		},
		Repositories: Repositories{
			Account: repositories.NewAccountRepository(pool),
			Vote: repositories.NewVoteRepository(pool),
			Platform: repositories.NewPlatformRepository(pool),
		},
		HTTPError: httperror.NewClient(ctx),
		env:       env,
	}, nil
}

func (app *Application) Router(env *env.Env) http.Handler {
	r := chi.NewRouter()

	r.Group(func(r chi.Router) {
		r.Use(middleware.AuthMiddleware("ShacRealm", map[string]string{
			env.BasicUser: env.BasicPass,
		}))
		r.Route("/accounts", func(r chi.Router) {
			r.Get("/", app.GetAccounts)
			r.Post("/", app.CreateAccount)
			r.Get("/{accountId}", app.GetAccount)
			r.Patch("/{accountId}", app.UpdateAccount)
			r.Delete("/{accountId}", app.DeleteAccount)
		})

		r.Route("/creators/{creatorId}/accounts", func(r chi.Router) {
			r.Get("/", app.GetCreatorAccounts)
			r.Get("/votes", app.GetCreatorAccountsVotes)
			r.Get("/{accountId}/votes", app.GetCreatorAccountVote)
		})

		r.Route("/platforms", func(r chi.Router) {
			r.Get("/", app.GetPlatforms)
		})

		r.Route("/votes", func(r chi.Router) {
			r.Post("/", app.CreateVote)
			r.Delete("/{voteId}", app.DeleteVote)
		})
	})

	return r
}

func (app Application) Close() {
	app.Clients.Pool.Close()
	app.HTTPError.Close()
}
