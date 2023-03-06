package common

import (
	"errors"
	"net/url"
	"strconv"
)

type Pagination interface {
	SearchTerm() string
	Limit() int
	Offset() int
	Page() int
	Sort() string
	Order() string
}

type pagination struct {
	searchTerm string
	page  int
	limit int
	sort string
	order string
}

var ErrPageToSmall = errors.New("page must be greater than 0")
var ErrPageLimitToSmall = errors.New("limit must be greater than 0")
var ErrPageLimitToHigh = errors.New("the maximum limit is 100")
var ErrPageSortValue = errors.New("sort value not valid")
var ErrPageOrderValue = errors.New("order value not valid")

func NewPagination(searchTerm string, page int, limit int, sort string, order string) (Pagination, error) {
	if page < 1 {
		return nil, ErrPageToSmall
	}

	if limit < 1 {
		return nil, ErrPageLimitToSmall
	}

	if limit > 100 {
		return nil, ErrPageLimitToHigh
	}

	if len(sort) > 0 {
		values := []string{"id", "username", "password", "votes_up", "votes_down", "created_at"}
		if !Contains(values, sort) {
			return nil, ErrPageSortValue
		}
	} else {
		sort = "id"
	}

	if len(order) > 0 {
		values := []string{"ASC", "DESC"}
		if !Contains(values, order) {
			return nil, ErrPageOrderValue
		}
	} else {
		order = "ASC"
	}

	return pagination{
		searchTerm: searchTerm,
		page:  page,
		limit: limit,
		sort: sort,
		order: order,
	}, nil
}

func NewPaginationFromURL(urlValues url.Values) (Pagination, error) {
	searchTerm := urlValues.Get("q")
	page, err := strconv.Atoi(urlValues.Get("page"))
	if err != nil {
		page = 1
	}
	limit, err := strconv.Atoi(urlValues.Get("limit"))
	if err != nil {
		limit = 10
	}
	sort := urlValues.Get("sort")
	order := urlValues.Get("order")

	return NewPagination(searchTerm, page, limit, sort, order)
}

func (p pagination) Page() int {
	return p.page
}

func (p pagination) Limit() int {
	return p.limit
}

func (p pagination) Offset() int {
	return (p.page - 1) * p.limit
}

func (p pagination) Sort() string {
	return p.sort
}

func (p pagination) Order() string {
	return p.order
}

func (p pagination) SearchTerm() string {
	return p.searchTerm
}
