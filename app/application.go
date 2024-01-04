package app

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/on3k/shac-api/common/env"
	"github.com/on3k/shac-api/repositories"
)

type Application struct {
	Repositories Repositories
}

type Repositories struct {
	Account repositories.AccountRepository
	Vote repositories.VoteRepository
	Platform repositories.PlatformRepository
}

func NewApplication(ctx context.Context, env *env.Env) Application {
	config, err := pgxpool.ParseConfig(env.DbUrl)
	if err != nil {
		panic(err)
	}
	pool, err := pgxpool.NewWithConfig(ctx, config)
	if err != nil {
		panic(err)
	}

	return Application{
		Repositories{
			Account: repositories.NewAccountRepository(pool),
			Vote: repositories.NewVoteRepository(pool),
			Platform: repositories.NewPlatformRepository(pool),
		},
	}
}
