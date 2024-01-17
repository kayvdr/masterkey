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

type AccountRepository struct {
	pool  *pgxpool.Pool
}

func NewAccountRepository(pool *pgxpool.Pool) AccountRepository {
	return AccountRepository{pool}
}

type Account struct {
	Id  uuid.UUID `db:"id"`
	Username   string      `db:"username"`
	Password string    `db:"password"`
	VotesUp *int    `db:"voteUp"`
	VotesDown *int    `db:"votesDown"`
	CreatorId uuid.UUID    `db:"creator_id"`
	CreatedAt time.Time    `db:"created_at"`
	Platform  Platform    `db:"platform"`
}

func (r AccountRepository) GetAccount(ctx context.Context, id uuid.UUID) (*Account, error) {
	account := Account{}
	err := r.pool.QueryRow(ctx, `
		SELECT u.id, u.username, u.password,
			(SELECT count(v.id) FROM votes AS v WHERE v.account_id = u.id AND v.value = 'up') AS votes_up, 
			(SELECT count(v.id) FROM votes AS v WHERE v.account_id = u.id AND v.value = 'down') AS votes_down, 
			u.created_at, u.creator_id, p.id, p.name, p.url 
	 	FROM accounts AS u 
		INNER JOIN platforms AS p ON u.platform_id = p.id 
		WHERE u.id = $1
	`, id).Scan(
		&account.Id,
		&account.Username,
		&account.Password,
		&account.VotesUp,
		&account.VotesDown,
		&account.CreatedAt,
		&account.CreatorId,
		&account.Platform.Id,
		&account.Platform.Name,
		&account.Platform.URL,
	)
	return &account, err
}

func (r AccountRepository) GetAccounts(ctx context.Context, pagination common.Pagination) ([]*Account, error) {
	params := fmt.Sprintf("ORDER BY u.%s LIMIT %s OFFSET %s", pagination.Sort() + " " + pagination.Order(), strconv.FormatInt(int64(pagination.Limit()), 10), strconv.FormatInt(int64(pagination.Offset()), 10))
	rows, err := r.pool.Query(ctx, `
		SELECT u.id, u.username, u.password, 
			(SELECT count(v.id) FROM votes AS v WHERE v.account_id = u.id AND v.value = 'up') AS votes_up, 
			(SELECT count(v.id) FROM votes AS v WHERE v.account_id = u.id AND v.value = 'down') AS votes_down, 
			u.created_at, u.creator_id, p.id, p.name, p.url
		FROM accounts AS u 
		INNER JOIN platforms AS p ON u.platform_id = p.id
		WHERE ($1 = '' OR p.name ILIKE $1)
	`+params, pg.ILIKE(pagination.SearchTerm()))

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	accounts := []*Account{}
	for rows.Next() {
		account := &Account{}
		rows.Scan(
			&account.Id,
			&account.Username,
			&account.Password,
			&account.VotesUp,
			&account.VotesDown,
			&account.CreatedAt,
			&account.CreatorId,
			&account.Platform.Id,
			&account.Platform.Name,
			&account.Platform.URL,
		)
		accounts = append(accounts, account)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return accounts, nil
}

func (r AccountRepository) GetAccountsByCreator(ctx context.Context, pagination common.Pagination, accountId uuid.UUID) ([]*Account, error) {
	rows, err := r.pool.Query(ctx, `
		SELECT u.id, u.username, u.password,
			(SELECT count(v.id) FROM votes AS v WHERE v.account_id = u.id AND v.value = 'up') AS votes_up, 
			(SELECT count(v.id) FROM votes AS v WHERE v.account_id = u.id AND v.value = 'down') AS votes_down, 
		u.created_at, u.creator_id, u.platform_id, p.name, p.url
		FROM accounts AS u 
		INNER JOIN platforms AS p ON u.platform_id = p.id
		WHERE creator_id = $1
	`, accountId)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	accounts := []*Account{}
	for rows.Next() {
		account := &Account{}
		rows.Scan(
			&account.Id,
			&account.Username,
			&account.Password,
			&account.VotesUp,
			&account.VotesDown,
			&account.CreatedAt,
			&account.CreatorId,
			&account.Platform.Id,
			&account.Platform.Name,
			&account.Platform.URL,
		)
		accounts = append(accounts, account)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return accounts, nil
}

func (r AccountRepository) GetAccountVotes(ctx context.Context, accountId uuid.UUID) ([]*Vote, error) {
	rows, err := r.pool.Query(ctx, `
		SELECT * FROM votes
		WHERE account_id = $1
	`, accountId)

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
			&vote.AccountId,
			&vote.CreatorId,
		)
		votes = append(votes, vote)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return votes, nil
}

func (r AccountRepository) GetAccountsCount(ctx context.Context, pagination common.Pagination) (*int, error) {
	var count int
	err := r.pool.QueryRow(ctx, `SELECT count(*)
	FROM accounts AS u 
	INNER JOIN platforms AS p ON u.platform_id = p.id
	WHERE ($1 = '' OR p.name ILIKE $1)`, pg.ILIKE(pagination.SearchTerm())).Scan(
		&count,
	)
	return &count, err
}

func (r AccountRepository) CreateAccount(ctx context.Context, account Account) (*Account, error) {
	var accountId uuid.UUID
	err := r.pool.QueryRow(ctx, `
		INSERT INTO accounts (id, username, password, platform_id, creator_id) 
		VALUES (gen_random_uuid(), $1, $2, $3, $4)
		RETURNING id`, 
		account.Username, 
		account.Password,
		account.Platform.Id,
		account.CreatorId,
	).Scan(&accountId);

	if err != nil {
		return nil, err
	}
	return r.GetAccount(ctx, accountId)
}

func (r AccountRepository) UpdateAccount(ctx context.Context, account Account) (*Account, error) {
	_, err := r.pool.Exec(ctx, `
		UPDATE accounts
		SET
		username = $1
		, password = $2
		, platform_id = $3
		WHERE id = $4`,
		account.Username,
		account.Password,
		account.Platform.Id,
		account.Id,
	);

	if err != nil {
		return nil, err
	}
	return r.GetAccount(ctx, account.Id)
}

func (r AccountRepository) ExistsAccount(ctx context.Context, accountId uuid.UUID) (bool, error) {
	exists := false
	err := r.pool.QueryRow(ctx, `
		SELECT EXISTS (SELECT NULL FROM accounts WHERE id = $1)
	`, accountId).Scan(&exists)
	return exists, err
}

func (r AccountRepository) DeleteAccount(ctx context.Context, accountId uuid.UUID) (bool, error) {
	_, err := r.pool.Exec(ctx, `
		DELETE FROM accounts 
		WHERE id = $1
	`, accountId)

	if err != nil {
		return false, err
	}
	return true, nil
}
