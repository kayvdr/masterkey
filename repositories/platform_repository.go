package repositories

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PlatformRepository struct {
	pool  *pgxpool.Pool
}

func NewPlatformRepository(pool *pgxpool.Pool) PlatformRepository {
	return PlatformRepository{pool}
}

type Platform struct {
	ID  uuid.UUID `db:"id"`
	Name string    `db:"name"`
	URL string    `db:"url"`
}

func (r PlatformRepository) GetPlatforms(ctx context.Context) ([]Platform, error) {
	rows, err := r.pool.Query(ctx, `SELECT id, name, url FROM platforms ORDER BY name`)

	if err != nil {
		return nil, err
	}
	
	return pgx.CollectRows(rows, pgx.RowToStructByName[Platform])
}
