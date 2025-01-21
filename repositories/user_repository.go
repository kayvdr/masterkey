package repositories

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/kayvdr/masterkey/common/pg"
)

type UserRepository struct {
	pool *pgxpool.Pool
}

func NewUserRepository(pool *pgxpool.Pool) UserRepository {
	return UserRepository{pool}
}

type User struct {
	ID          uuid.UUID `db:"id"`
	UserID      uuid.UUID `db:"user_id"`
	RequestedAt time.Time `db:"requested_at"`
}

func (r UserRepository) CreateDeleteRequest(ctx context.Context, userID uuid.UUID) (u *User, err error) {
	err = pgx.BeginFunc(ctx, r.pool, func(tx pgx.Tx) (err error) {
		var id uuid.UUID
		err = tx.QueryRow(ctx, `
			INSERT INTO user_delete_request (id, user_id) 
			VALUES (gen_random_uuid(), $1)
			RETURNING id`,
			userID,
		).Scan(&id)

		if err != nil {
			return
		}
		u, err = queryUser(ctx, tx, id)
		return
	})

	return
}

func (r UserRepository) ExistsUser(ctx context.Context, userID uuid.UUID) (exists bool, err error) {
	err = r.pool.QueryRow(ctx, `SELECT EXISTS (SELECT NULL FROM user_delete_request WHERE user_id = $1)`, userID).Scan(&exists)
	return
}

func queryUser(ctx context.Context, querier pg.Querier, userID uuid.UUID) (u *User, err error) {
	rows, err := querier.Query(ctx, `
		SELECT id, user_id, requested_at FROM user_delete_request WHERE id = $1
	`, userID)
	if err != nil {
		return
	}

	u, err = pgx.CollectOneRow(rows, pgx.RowToAddrOfStructByName[User])
	if err == pgx.ErrNoRows {
		return nil, ErrAccountNotFound
	}

	return
}
