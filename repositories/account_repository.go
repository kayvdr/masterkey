package repositories

import (
	"context"
	"errors"
	"fmt"
	"strconv"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/kayvdr/shac/common"
	"github.com/kayvdr/shac/common/pg"
)

type AccountRepository struct {
	pool  *pgxpool.Pool
}

func NewAccountRepository(pool *pgxpool.Pool) AccountRepository {
	return AccountRepository{pool}
}

type Account struct {
	ID  uuid.UUID `db:"id"`
	Username   string      `db:"username"`
	Password string    `db:"password"`
	VotesUp int    `db:"votes_up"`
	VotesDown int    `db:"votes_down"`
	CreatorID uuid.UUID    `db:"creator_id"`
	CreatedAt time.Time    `db:"created_at"`
	PlatformID  uuid.UUID    `db:"platform_id"`
	PlatformName  string    `db:"platform_name"`
	PlatformURL  string    `db:"platform_url"`
	FullCount  int    `db:"full_count"`
}

var ErrAccountNotFound = errors.New("account not found")

func (r AccountRepository) GetAccount(ctx context.Context, accountID uuid.UUID) (*Account, error) {
	return queryAccount(ctx, r.pool, accountID)
}

func (r AccountRepository) GetAccounts(ctx context.Context, pagination common.Pagination) ([]Account, error) {
	params := fmt.Sprintf("ORDER BY %s LIMIT %s OFFSET %s", pagination.Sort() + " " + pagination.Order(), strconv.Itoa(pagination.Limit()), strconv.Itoa(pagination.Offset()))
	rows, err := r.pool.Query(ctx, `
		SELECT a.id, a.username, a.password, 
			(SELECT count(v.id) FROM votes AS v WHERE v.account_id = a.id AND v.value = 'up') AS votes_up, 
			(SELECT count(v.id) FROM votes AS v WHERE v.account_id = a.id AND v.value = 'down') AS votes_down, 
			a.created_at, a.creator_id, p.id AS platform_id, p.name AS platform_name, p.url  AS platform_url,
			count(*) OVER() AS full_count
		FROM accounts AS a 
		INNER JOIN platforms AS p ON a.platform_id = p.id
		WHERE ($1 = '' OR p.name ILIKE $1 OR a.username ILIKE $1)
	`+params, pg.ILIKE(pagination.SearchTerm()))
	if err != nil {
		return nil, err
	}

	return pgx.CollectRows(rows, pgx.RowToStructByName[Account])
}

func (r AccountRepository) GetCreatorAccounts(ctx context.Context, pagination common.Pagination, accountID uuid.UUID) ([]Account, error) {
	params := fmt.Sprintf("ORDER BY %s LIMIT %s OFFSET %s", pagination.Sort() + " " + pagination.Order(), strconv.Itoa(pagination.Limit()), strconv.Itoa(pagination.Offset()))
	rows, err := r.pool.Query(ctx, `
		SELECT a.id, a.username, a.password,
			(SELECT count(v.id) FROM votes AS v WHERE v.account_id = a.id AND v.value = 'up') AS votes_up, 
			(SELECT count(v.id) FROM votes AS v WHERE v.account_id = a.id AND v.value = 'down') AS votes_down, 
			a.created_at, a.creator_id, p.id AS platform_id, p.name AS platform_name, p.url  AS platform_url,
			count(*) OVER() AS full_count
		FROM accounts AS a 
		INNER JOIN platforms AS p ON a.platform_id = p.id
		WHERE creator_id = $1
	`+params, accountID)

	if err != nil {
		return nil, err
	}

	return pgx.CollectRows(rows, pgx.RowToStructByName[Account])
}

func (r AccountRepository) GetCreatorAccountsVotes(ctx context.Context, pagination common.Pagination, accountID uuid.UUID) ([]Account, error) {
	params := fmt.Sprintf("ORDER BY %s LIMIT %s OFFSET %s", pagination.Sort() + " " + pagination.Order(), strconv.Itoa(pagination.Limit()), strconv.Itoa(pagination.Offset()))
	rows, err := r.pool.Query(ctx, `
	SELECT a.id, a.username, a.password,
		(SELECT count(v.id) FROM votes AS v WHERE v.account_id = a.id AND v.value = 'up') AS votes_up, 
		(SELECT count(v.id) FROM votes AS v WHERE v.account_id = a.id AND v.value = 'down') AS votes_down, 
		a.created_at, a.creator_id, p.id AS platform_id, p.name AS platform_name, p.url  AS platform_url,
		count(*) OVER() AS full_count
	FROM accounts AS a 
	INNER JOIN platforms AS p ON a.platform_id = p.id
	INNER JOIN votes v ON v.account_id = a.id
	WHERE v.creator_id = $1
	`+params, accountID)

	if err != nil {
		return nil, err
	}

	return pgx.CollectRows(rows, pgx.RowToStructByName[Account])
}

func (r AccountRepository) CreateAccount(ctx context.Context, account Account) (a *Account, err error) {
	err = pgx.BeginFunc(ctx, r.pool, func(tx pgx.Tx) (err error) {
		var accountID uuid.UUID
		err = tx.QueryRow(ctx, `
			INSERT INTO accounts (id, username, password, platform_id, creator_id) 
			VALUES (gen_random_uuid(), $1, $2, $3, $4)
			RETURNING id`, 
			account.Username, 
			account.Password,
			account.PlatformID,
			account.CreatorID,
		).Scan(&accountID);

		if err != nil {
			return
		}
		a, err = queryAccount(ctx,tx, accountID)
		return
	})

	return
}

func (r AccountRepository) UpdateAccount(ctx context.Context, account Account, accountID uuid.UUID) (a *Account, err error) {
	err = pgx.BeginFunc(ctx, r.pool, func(tx pgx.Tx) (err error) {
		_, err = r.pool.Exec(ctx, `
			UPDATE accounts
			SET
			username = $1
			, password = $2
			, platform_id = $3
			WHERE id = $4`,
			account.Username,
			account.Password,
			account.PlatformID,
			accountID,
		);

		if err != nil {
			return
		}
		a, err = queryAccount(ctx,tx, accountID)
		return
	})

	return
}

func (r AccountRepository) ExistsAccount(ctx context.Context, accountID uuid.UUID) (exists bool, err error) {
	err = r.pool.QueryRow(ctx, `SELECT EXISTS (SELECT NULL FROM accounts WHERE id = $1)`, accountID).Scan(&exists)
	return
}

func (r AccountRepository) DeleteAccount(ctx context.Context, accountID uuid.UUID) (bool, error) {
	_, err := r.pool.Exec(ctx, `
		DELETE FROM accounts 
		WHERE id = $1
	`, accountID)

	if err != nil {
		return false, err
	}
	return true, nil
}

func queryAccount(ctx context.Context, querier pg.Querier, accountID uuid.UUID) (a *Account, err error) {
	rows, err := querier.Query(ctx, `
	SELECT a.id, a.username, a.password,
		(SELECT count(v.id) FROM votes AS v WHERE v.account_id = a.id AND v.value = 'up') AS votes_up, 
		(SELECT count(v.id) FROM votes AS v WHERE v.account_id = a.id AND v.value = 'down') AS votes_down, 
		a.created_at, a.creator_id, p.id AS platform_id, p.name AS platform_name, p.url as platform_url, 
		count(*) OVER() AS full_count
	FROM accounts AS a 
	INNER JOIN platforms AS p ON a.platform_id = p.id 
	WHERE a.id = $1
	`, accountID)
	if err != nil {
		return
	}

	a, err = pgx.CollectOneRow(rows, pgx.RowToAddrOfStructByName[Account])
	if err == pgx.ErrNoRows {
		return nil, ErrAccountNotFound
	}

	return
}