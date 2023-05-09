package repositories

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type VoteRepository struct {
	pool  *pgxpool.Pool
}

type Vote struct {
	Id  uuid.UUID `json:"id"`
	Value string    `json:"value"`
	UserId uuid.UUID    `json:"user_id"`
	CreatedBy uuid.UUID    `json:"created_by"`
}

var ErrMultipleVotes = errors.New("multiple user votes are not valid")

func NewVoteRepository(pool *pgxpool.Pool) VoteRepository {
	return VoteRepository{pool}
}

func (r UserRepository) GetVote(ctx context.Context, id uuid.UUID) (*Vote, error) {
	vote := Vote{}
	err := r.pool.QueryRow(ctx, `SELECT v.id, v.value, v.user_id, v.created_by FROM votes AS v WHERE id = $1`, id).Scan(
		&vote.Id,
		&vote.Value,
		&vote.UserId,
		&vote.CreatedBy,
	)
	return &vote, err
}

func (r UserRepository) CreateVote(ctx context.Context, vote Vote) (*Vote, error) {
	var voteId uuid.UUID
	err := r.pool.QueryRow(ctx, `
		INSERT INTO votes (id, value, user_id, created_by)
		SELECT gen_random_uuid(), $1, $2, $3
		WHERE NOT EXISTS (
			SELECT * FROM votes WHERE user_id=$2 AND created_by=$3
		)
		RETURNING id
		`, 
		vote.Value,
		vote.UserId,
		vote.CreatedBy,
	).Scan(&voteId);

	if err == pgx.ErrNoRows {
		return nil, ErrMultipleVotes
	}
	if err != nil {
		return nil, err
	}
	return r.GetVote(ctx, voteId)
}

func (r UserRepository) DeleteVote(ctx context.Context, voteId uuid.UUID) (bool, error) {
	_, err := r.pool.Exec(ctx, `
		DELETE FROM votes 
		WHERE id = $1
	`, voteId)

	if err != nil {
		return false, err
	}
	return true, nil
}