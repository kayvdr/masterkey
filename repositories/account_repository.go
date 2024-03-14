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
}

var ErrAccountNotFound = errors.New("account not found")

func (r AccountRepository) GetAccount(ctx context.Context, accountID uuid.UUID) (*Account, error) {
	return queryAccount(ctx, r.pool, accountID)
}

func (r AccountRepository) GetAccounts(ctx context.Context, pagination common.Pagination) ([]Account, error) {
	params := fmt.Sprintf("ORDER BY %s LIMIT %s OFFSET %s", pagination.Sort() + " " + pagination.Order(), strconv.Itoa(pagination.Limit()), strconv.Itoa(pagination.Offset()))
	rows, err := r.pool.Query(ctx, `
		SELECT u.id, u.username, u.password, 
			(SELECT count(v.id) FROM votes AS v WHERE v.account_id = u.id AND v.value = 'up') AS votes_up, 
			(SELECT count(v.id) FROM votes AS v WHERE v.account_id = u.id AND v.value = 'down') AS votes_down, 
			u.created_at, u.creator_id, p.id AS platform_id, p.name AS platform_name, p.url  AS platform_url
		FROM accounts AS u 
		INNER JOIN platforms AS p ON u.platform_id = p.id
		WHERE ($1 = '' OR p.name ILIKE $1)
	`+params, pg.ILIKE(pagination.SearchTerm()))
	if err != nil {
		return nil, err
	}

	return pgx.CollectRows(rows, pgx.RowToStructByName[Account])
}

func (r AccountRepository) GetAccountsByCreator(ctx context.Context, pagination common.Pagination, accountID uuid.UUID) ([]Account, error) {
	rows, err := r.pool.Query(ctx, `
		SELECT u.id, u.username, u.password,
			(SELECT count(v.id) FROM votes AS v WHERE v.account_id = u.id AND v.value = 'up') AS votes_up, 
			(SELECT count(v.id) FROM votes AS v WHERE v.account_id = u.id AND v.value = 'down') AS votes_down, 
			u.created_at, u.creator_id, p.id AS platform_id, p.name AS platform_name, p.url  AS platform_url
		FROM accounts AS u 
		INNER JOIN platforms AS p ON u.platform_id = p.id
		WHERE creator_id = $1
	`, accountID)

	if err != nil {
		return nil, err
	}

	return pgx.CollectRows(rows, pgx.RowToStructByName[Account])
}

func (r AccountRepository) GetAccountVotes(ctx context.Context, accountID uuid.UUID, creatorID uuid.NullUUID) ([]Vote, error) {
	rows, err := r.pool.Query(ctx, `
		SELECT v.id, v.value, v.account_id, v.creator_id, a.username, p.name AS platform_name FROM votes v
		INNER JOIN accounts AS a ON v.account_id = a.id
		INNER JOIN platforms AS p ON a.platform_id = p.id
		WHERE v.account_id = $1
			AND (v.creator_id = $2 OR ($2 IS NULL AND v.creator_id IS NOT NULL))
	`, accountID, creatorID)

	if err != nil {
		return nil, err
	}
	
	return pgx.CollectRows(rows, pgx.RowToStructByName[Vote])
}

func (r AccountRepository) GetAccountsCount(ctx context.Context, pagination common.Pagination) (count int, err error) {
	err = r.pool.QueryRow(ctx, `
		SELECT count(*)
		FROM accounts AS u 
		INNER JOIN platforms AS p ON u.platform_id = p.id
		WHERE ($1 = '' OR p.name ILIKE $1)
	`, pg.ILIKE(pagination.SearchTerm()),
	).Scan(&count)
	return
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
	SELECT u.id, u.username, u.password,
		(SELECT count(v.id) FROM votes AS v WHERE v.account_id = u.id AND v.value = 'up') AS votes_up, 
		(SELECT count(v.id) FROM votes AS v WHERE v.account_id = u.id AND v.value = 'down') AS votes_down, 
		u.created_at, u.creator_id, p.id AS platform_id, p.name AS platform_name, p.url as platform_url 
	FROM accounts AS u 
	INNER JOIN platforms AS p ON u.platform_id = p.id 
	WHERE u.id = $1
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