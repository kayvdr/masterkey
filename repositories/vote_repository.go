package repositories

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/on3k/shac-api/common/pg"
)

type Value string

const (
    Up Value = "up"
    Down Value = "down"
)

type VoteRepository struct {
	pool  *pgxpool.Pool
}

type Vote struct {
	ID  uuid.UUID `db:"id"`
	Value Value    `db:"value"`
	Username string    `db:"username"`
	PlatformName string    `db:"platform_name"`
	AccountID uuid.UUID    `db:"account_id"`
	CreatorID uuid.UUID    `db:"creator_id"`
}

var ErrVoteNotFound = errors.New("Vote not found")
var ErrMultipleVotes = errors.New("multiple account votes are not valid")

func NewVoteRepository(pool *pgxpool.Pool) VoteRepository {
	return VoteRepository{pool}
}

func (r VoteRepository) GetVote(ctx context.Context, id uuid.UUID) (*Vote, error) {
	return queryVote(ctx, r.pool, id)
}

func (r VoteRepository) CreateVote(ctx context.Context, vote Vote) (v *Vote, err error) {
	err = pgx.BeginFunc(ctx, r.pool, func(tx pgx.Tx) (err error) {
		var voteID uuid.UUID
		err = r.pool.QueryRow(ctx, `
			INSERT INTO votes (id, value, account_id, creator_id)
			SELECT gen_random_uuid(), $1, $2, $3
			WHERE NOT EXISTS (
				SELECT * FROM votes WHERE account_id=$2 AND creator_id=$3
			)
			RETURNING id
			`, 
			vote.Value,
			vote.AccountID,
			vote.CreatorID,
		).Scan(&voteID);

		if err == pgx.ErrNoRows {
			err = ErrMultipleVotes
			return
		}
		if err != nil {
			return
		}
		v, err = queryVote(ctx,tx, voteID)
		return
	})

	return
}

func (r VoteRepository) ExistsVote(ctx context.Context, voteID uuid.UUID) (exists bool, err error) {
	err = r.pool.QueryRow(ctx, `SELECT EXISTS (SELECT NULL FROM votes WHERE id = $1)`, voteID).Scan(&exists)
	return
}

func (r VoteRepository) DeleteVote(ctx context.Context, voteID uuid.UUID) (bool, error) {
	_, err := r.pool.Exec(ctx, `
		DELETE FROM votes 
		WHERE id = $1
	`, voteID)

	if err != nil {
		return false, err
	}
	return true, nil
}

func queryVote(ctx context.Context, querier pg.Querier, voteID uuid.UUID) (v *Vote, err error) {
	rows, err := querier.Query(ctx, `
		SELECT v.id, v.value, v.creator_id, a.id AS account_id, a.username, p.name AS platform_name FROM votes AS v
		INNER JOIN accounts AS a ON v.account_id = a.id
		INNER JOIN platforms AS p ON a.platform_id = p.id
		WHERE v.id = $1
	`, voteID)
	if err != nil {
		return
	}

	v, err = pgx.CollectOneRow(rows, pgx.RowToAddrOfStructByName[Vote])
	if err == pgx.ErrNoRows {
		return nil, ErrVoteNotFound
	}

	return
}