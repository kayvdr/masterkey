package repositories

import (
	"context"
	"fmt"
	"strconv"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/on3k/api-test/common"
	"github.com/on3k/api-test/common/pg"
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
	VotesUp *int    `json:"votes_up"`
	VotesDown *int    `json:"votes_down"`
	CreatedAt time.Time    `json:"created_at"`
	PlatformId uuid.UUID    `json:"platform_id"`
}

func (r UserRepository) GetUser(ctx context.Context, id uuid.UUID) (*User, error) {
	user := User{}
	err := r.pool.QueryRow(ctx, `SELECT u.id, u.username, u.password, u.votes_up, u.votes_down, u.created_at, u.platform_id FROM users AS u WHERE id = $1`, id).Scan(
		&user.Id,
		&user.Username,
		&user.Password,
		&user.VotesUp,
		&user.VotesDown,
		&user.CreatedAt,
		&user.PlatformId,
	)
	return &user, err
}

func (r UserRepository) GetAllUsers(ctx context.Context, pagination common.Pagination) ([]*User, error) {
	params := fmt.Sprintf("ORDER BY %s LIMIT %s OFFSET %s", pagination.Sort() + " " + pagination.Order(), strconv.FormatInt(int64(pagination.Limit()), 10), strconv.FormatInt(int64(pagination.Offset()), 10))
	rows, err := r.pool.Query(ctx, `
		SELECT u.id, u.username, u.password, u.votes_up, u.votes_down, u.created_at, u.platform_id
		FROM users AS u 
		INNER JOIN platforms AS p ON u.platform_id = p.id
		WHERE ($1 = '' OR p.name ILIKE $1)
	`+params, pg.ILIKE(pagination.SearchTerm()))

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	users := []*User{}
	for rows.Next() {
		user := &User{}
		rows.Scan(
			&user.Id,
			&user.Username,
			&user.Password,
			&user.VotesUp,
			&user.VotesDown,
			&user.CreatedAt,
			&user.PlatformId,
		)
		users = append(users, user)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return users, nil
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
		INSERT INTO users (id, username, password, votes_up, votes_down, platform_id) 
		VALUES (gen_random_uuid(), $1, $2, $3, $4, $5)
		RETURNING id`, 
		user.Username, 
		user.Password, 
		user.VotesUp, 
		user.VotesDown, 
		user.PlatformId,
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
		, votes_up = $3
		, votes_down = $4
		, platform_id = $5
		WHERE id = $6`, 
		user.Username, 
		user.Password, 
		user.VotesUp, 
		user.VotesDown, 
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

func (r UserRepository) DeleteUser(ctx context.Context, b2cUserId uuid.UUID) (bool, error) {
	_, err := r.pool.Exec(ctx, `
		DELETE FROM users 
		WHERE id = $1
	`, b2cUserId)

	if err != nil {
		return false, err
	}
	return true, nil
}
