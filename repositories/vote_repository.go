package repositories

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/on3k/shac-api/common"
)

type VoteRepository struct {
	pool  *pgxpool.Pool
}

type Vote struct {
	Id  uuid.UUID `json:"id"`
	Value string    `json:"value"`
	UserId uuid.UUID    `json:"user_id"`
	CreatorId uuid.UUID    `json:"creator_id"`
}

type FullVote struct {
	Id  uuid.UUID `json:"id"`
	Value string    `json:"value"`
	Username string    `json:"username"`
	PlatformName string    `json:"platform_name"`
}

var ErrMultipleVotes = errors.New("multiple user votes are not valid")

func NewVoteRepository(pool *pgxpool.Pool) VoteRepository {
	return VoteRepository{pool}
}

func (r VoteRepository) GetVote(ctx context.Context, id uuid.UUID) (*Vote, error) {
	vote := Vote{}
	err := r.pool.QueryRow(ctx, `SELECT v.id, v.value, v.user_id, v.creator_id FROM votes AS v WHERE id = $1`, id).Scan(
		&vote.Id,
		&vote.Value,
		&vote.UserId,
		&vote.CreatorId,
	)
	return &vote, err
}

func (r VoteRepository) CreateVote(ctx context.Context, vote Vote) (*Vote, error) {
	var voteId uuid.UUID
	err := r.pool.QueryRow(ctx, `
		INSERT INTO votes (id, value, user_id, creator_id)
		SELECT gen_random_uuid(), $1, $2, $3
		WHERE NOT EXISTS (
			SELECT * FROM votes WHERE user_id=$2 AND creator_id=$3
		)
		RETURNING id
		`, 
		vote.Value,
		vote.UserId,
		vote.CreatorId,
	).Scan(&voteId);

	if err == pgx.ErrNoRows {
		return nil, ErrMultipleVotes
	}
	if err != nil {
		return nil, err
	}
	return r.GetVote(ctx, voteId)
}

func (r VoteRepository) GetVotesByCreator(ctx context.Context, pagination common.Pagination, creatorId uuid.UUID) ([]*FullVote, error) {
	rows, err := r.pool.Query(ctx, `
		SELECT v.id, v.value, u.username, p.name FROM votes AS v
		INNER JOIN users AS u ON v.user_id = u.id
		INNER JOIN platforms AS p ON u.platform_id = p.id
		WHERE v.creator_id = $1
	`, creatorId)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	votes := []*FullVote{}
	for rows.Next() {
		vote := &FullVote{}
		rows.Scan(
			&vote.Id,
			&vote.Value,
			&vote.Username,
			&vote.PlatformName,
		)
		votes = append(votes, vote)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return votes, nil
}

func (r VoteRepository) ExistsVote(ctx context.Context, voteId uuid.UUID) (bool, error) {
	exists := false
	err := r.pool.QueryRow(ctx, `
		SELECT EXISTS (SELECT NULL FROM votes WHERE id = $1)
	`, voteId).Scan(&exists)
	return exists, err
}

func (r VoteRepository) DeleteVote(ctx context.Context, voteId uuid.UUID) (bool, error) {
	_, err := r.pool.Exec(ctx, `
		DELETE FROM votes 
		WHERE id = $1
	`, voteId)

	if err != nil {
		return false, err
	}
	return true, nil
}