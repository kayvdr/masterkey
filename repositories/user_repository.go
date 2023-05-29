package repositories

import (
	"context"
	"fmt"
	"strconv"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/on3k/shac-api/common"
	"github.com/on3k/shac-api/common/pg"
)

type UserRepository struct {
	pool  *pgxpool.Pool
}

func NewUserRepository(pool *pgxpool.Pool) UserRepository {
	return UserRepository{pool}
}

type User struct {
	Id  uuid.UUID `json:"id"`
	Username   string      `json:"username"`
	Password string    `json:"password"`
	CreatorId uuid.UUID    `json:"creator_id"`
	CreatedAt time.Time    `json:"created_at"`
	PlatformId uuid.UUID    `json:"platform_id"`
}

type FullUser struct {
	User
	VotesUp *int    `json:"votes_up"`
	VotesDown *int    `json:"votes_down"`
	PlatformName  string    `json:"name"`
	PlatformURL  string    `json:"url"`
}

func (r UserRepository) GetUser(ctx context.Context, id uuid.UUID) (*User, error) {
	user := User{}
	err := r.pool.QueryRow(ctx, `SELECT u.id, u.username, u.password, u.created_at, u.creator_id, u.platform_id FROM users AS u WHERE id = $1`, id).Scan(
		&user.Id,
		&user.Username,
		&user.Password,
		&user.CreatedAt,
		&user.CreatorId,
		&user.PlatformId,
	)
	return &user, err
}

func (r UserRepository) GetAllUsers(ctx context.Context, pagination common.Pagination) ([]*FullUser, error) {
	params := fmt.Sprintf("ORDER BY %s LIMIT %s OFFSET %s", pagination.Sort() + " " + pagination.Order(), strconv.FormatInt(int64(pagination.Limit()), 10), strconv.FormatInt(int64(pagination.Offset()), 10))
	rows, err := r.pool.Query(ctx, `
		SELECT u.id, u.username, u.password, 
			(SELECT count(v.id) FROM votes AS v WHERE v.user_id = u.id AND v.value = 'up') AS votes_up, 
			(SELECT count(v.id) FROM votes AS v WHERE v.user_id = u.id AND v.value = 'down') AS votes_down, 
			u.created_at, u.creator_id, u.platform_id, p.name, p.url
		FROM users AS u 
		INNER JOIN platforms AS p ON u.platform_id = p.id
		WHERE ($1 = '' OR p.name ILIKE $1)
	`+params, pg.ILIKE(pagination.SearchTerm()))

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	users := []*FullUser{}
	for rows.Next() {
		user := &FullUser{}
		rows.Scan(
			&user.Id,
			&user.Username,
			&user.Password,
			&user.VotesUp,
			&user.VotesDown,
			&user.CreatedAt,
			&user.CreatorId,
			&user.PlatformId,
			&user.PlatformName,
			&user.PlatformURL,
		)
		users = append(users, user)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return users, nil
}

func (r UserRepository) GetUsersByCreator(ctx context.Context, pagination common.Pagination, userId uuid.UUID) ([]*FullUser, error) {
	rows, err := r.pool.Query(ctx, `
		SELECT u.id, u.username, u.password,
			(SELECT count(v.id) FROM votes AS v WHERE v.user_id = u.id AND v.value = 'up') AS votes_up, 
			(SELECT count(v.id) FROM votes AS v WHERE v.user_id = u.id AND v.value = 'down') AS votes_down, 
		u.created_at, u.creator_id, u.platform_id, p.name, p.url
		FROM users AS u 
		INNER JOIN platforms AS p ON u.platform_id = p.id
		WHERE creator_id = $1
	`, userId)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	users := []*FullUser{}
	for rows.Next() {
		user := &FullUser{}
		rows.Scan(
			&user.Id,
			&user.Username,
			&user.Password,
			&user.VotesUp,
			&user.VotesDown,
			&user.CreatedAt,
			&user.CreatorId,
			&user.PlatformId,
			&user.PlatformName,
			&user.PlatformURL,
		)
		users = append(users, user)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return users, nil
}

func (r UserRepository) GetUserVotes(ctx context.Context, userId uuid.UUID) ([]*Vote, error) {
	rows, err := r.pool.Query(ctx, `
		SELECT * FROM votes
		WHERE user_id = $1
	`, userId)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	votes := []*Vote{}
	for rows.Next() {
		vote := &Vote{}
		rows.Scan(
			&vote.Id,
			&vote.Value,
			&vote.UserId,
			&vote.CreatorId,
		)
		votes = append(votes, vote)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return votes, nil
}

func (r UserRepository) GetUsersCount(ctx context.Context, pagination common.Pagination) (*int, error) {
	var count int
	err := r.pool.QueryRow(ctx, `SELECT count(*)
	FROM users AS u 
	INNER JOIN platforms AS p ON u.platform_id = p.id
	WHERE ($1 = '' OR p.name ILIKE $1)`, pg.ILIKE(pagination.SearchTerm())).Scan(
		&count,
	)
	return &count, err
}

func (r UserRepository) CreateUser(ctx context.Context, user *User) (*User, error) {
	var userId uuid.UUID
	err := r.pool.QueryRow(ctx, `
		INSERT INTO users (id, username, password, platform_id, creator_id) 
		VALUES (gen_random_uuid(), $1, $2, $3, $4)
		RETURNING id`, 
		user.Username, 
		user.Password,
		user.PlatformId,
		user.CreatorId,
	).Scan(&userId);

	if err != nil {
		return nil, err
	}
	return r.GetUser(ctx, userId)
}

func (r UserRepository) UpdateUser(ctx context.Context, user *User) (*User, error) {
	_, err := r.pool.Exec(ctx, `
		UPDATE users
		SET
		username = $1
		, password = $2
		, platform_id = $3
		WHERE id = $4`, 
		user.Username, 
		user.Password,
		user.PlatformId, 
		user.Id,
	);

	if err != nil {
		return nil, err
	}
	return r.GetUser(ctx, user.Id)
}

func (r UserRepository) ExistsUser(ctx context.Context, userId uuid.UUID) (bool, error) {
	exists := false
	err := r.pool.QueryRow(ctx, `
		SELECT EXISTS (SELECT NULL FROM users WHERE id = $1)
	`, userId).Scan(&exists)
	return exists, err
}

func (r UserRepository) DeleteUser(ctx context.Context, userId uuid.UUID) (bool, error) {
	_, err := r.pool.Exec(ctx, `
		DELETE FROM users 
		WHERE id = $1
	`, userId)

	if err != nil {
		return false, err
	}
	return true, nil
}
