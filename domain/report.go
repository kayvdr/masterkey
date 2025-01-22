package domain

import (
	"time"

	"github.com/google/uuid"
	"github.com/kayvdr/masterkey/repositories"
)

type Report struct {
	ID         uuid.UUID `db:"id"`
	AccountID  uuid.UUID `db:"account_id"`
	CreatorID  uuid.UUID `db:"creator_id"`
	ReportedAt time.Time `db:"reported_at"`
}

func NewReport(dbItem repositories.Report) Report {
	return Report{
		ID:         dbItem.ID,
		AccountID:  dbItem.AccountID,
		CreatorID:  dbItem.CreatorID,
		ReportedAt: dbItem.ReportedAt,
	}
}
