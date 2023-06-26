package repositories

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PlatformRepository struct {
	pool  *pgxpool.Pool
}

func NewPlatformRepository(pool *pgxpool.Pool) PlatformRepository {
	return PlatformRepository{pool}
}

type Platform struct {
	Id  uuid.UUID `db:"id"`
	Name string    `db:"name"`
	URL string    `db:"url"`
}

func (r PlatformRepository) GetAllPlatforms(ctx context.Context) ([]*Platform, error) {
	rows, err := r.pool.Query(ctx, `SELECT id, name, url FROM platforms ORDER BY name`)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	platforms := []*Platform{}
	for rows.Next() {
		platform := &Platform{}
		rows.Scan(
			&platform.Id,
			&platform.Name,
			&platform.URL,
		)
		platforms = append(platforms, platform)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return platforms, nil
}
