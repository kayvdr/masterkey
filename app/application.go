package app

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/on3k/api-test/common/env"
	"github.com/on3k/api-test/repositories"
)

type Application struct {
	Repositories Repositories
}

type Repositories struct {
	User repositories.UserRepository
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
			User: repositories.NewUserRepository(pool),
		},
	}
}
