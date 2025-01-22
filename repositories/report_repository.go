package repositories

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/kayvdr/masterkey/common/pg"
)

type ReportRepository struct {
	pool *pgxpool.Pool
}

func NewReportRepository(pool *pgxpool.Pool) ReportRepository {
	return ReportRepository{pool}
}

type Report struct {
	ID         uuid.UUID `db:"id"`
	AccountID  uuid.UUID `db:"account_id"`
	CreatorID  uuid.UUID `db:"creator_id"`
	ReportedAt time.Time `db:"reported_at"`
}

var ErrReportNotFound = errors.New("report not found")

func (r ReportRepository) CreateAccountReport(ctx context.Context, accountID uuid.UUID, creatorID uuid.UUID) (rp *Report, err error) {
	err = pgx.BeginFunc(ctx, r.pool, func(tx pgx.Tx) (err error) {
		var reportID uuid.UUID
		err = tx.QueryRow(ctx, `
			INSERT INTO reported_accounts (id, account_id, creator_id) 
			VALUES (gen_random_uuid(), $1, $2)
			RETURNING id`,
			accountID,
			creatorID,
		).Scan(&reportID)

		if err != nil {
			return
		}
		rp, err = queryReport(ctx, tx, reportID)
		return
	})

	return
}

func (r ReportRepository) ExistsReport(ctx context.Context, accountID uuid.UUID, creatorID uuid.UUID) (exists bool, err error) {
	err = r.pool.QueryRow(ctx, `SELECT EXISTS (SELECT NULL FROM reported_accounts WHERE account_id = $1 AND creator_id = $2)`, accountID, creatorID).Scan(&exists)
	return
}

func queryReport(ctx context.Context, querier pg.Querier, reportID uuid.UUID) (rp *Report, err error) {
	rows, err := querier.Query(ctx, `
		SELECT id, account_id, creator_id, reported_at
		FROM reported_accounts
		WHERE id = $1
	`, reportID)
	if err != nil {
		return
	}

	rp, err = pgx.CollectOneRow(rows, pgx.RowToAddrOfStructByName[Report])
	if err == pgx.ErrNoRows {
		return nil, ErrReportNotFound
	}

	return
}
