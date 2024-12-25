package httperror

import (
	"context"
	"errors"
	"net/http"

	"github.com/go-chi/render"
	"github.com/jackc/pgerrcode"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/kayvdr/shac/clients/errorreporting"
)

type Client struct {
	client errorreporting.Client
}

func NewClient(ctx context.Context) Client {
	return Client{errorreporting.NewClient(ctx)}
}

func (e Client) Close() {
	e.client.Close()
}

type ErrorDetails struct {
	Worksheet string `json:"worksheet"`
	Row       int    `json:"row"`
}

type httpError struct {
	Err        error
	StatusCode int
	Details    *ErrorDetails
}

func New(statusCode int, err error) *httpError {
	return &httpError{
		Err:        err,
		StatusCode: statusCode,
	}
}

func NewWithDetails(statusCode int, err error, details ErrorDetails) *httpError {
	return &httpError{
		Err:        err,
		StatusCode: statusCode,
		Details:    &details,
	}
}

func (e httpError) Error() string {
	return e.Err.Error()
}

func (e *Client) New(w http.ResponseWriter, r *http.Request, err error) {
	var hErr *httpError
	errors.As(err, &hErr)

	if hErr == nil {
		hErr = New(http.StatusInternalServerError, err)
	}

	// Only report it if it’s a server error.
	if hErr.StatusCode >= http.StatusInternalServerError {
		e.client.Report(r, hErr)
	}

	if pgErr := asDBError(err); pgErr != nil {
		switch code := pgErr.Code; {
		case pgerrcode.IsDataException(code):
			fallthrough
		case pgerrcode.IsIntegrityConstraintViolation(code):
			hErr.StatusCode = http.StatusBadRequest
		}
	}

	hErr.Render(w, r)
}

func (e *httpError) Render(w http.ResponseWriter, r *http.Request) error {
	type errResp struct {
		Code    int           `json:"code"`
		Message string        `json:"message"`
		Details *ErrorDetails `json:"details,omitempty"`
	}

	resp := struct {
		Error errResp `json:"error"`
	}{
		Error: errResp{Code: e.StatusCode, Message: e.Error(), Details: e.Details},
	}

	if e.StatusCode >= http.StatusInternalServerError {
		// Hide server error messages from the end user.
		resp.Error.Message = http.StatusText(e.StatusCode)
	}
	render.Status(r, e.StatusCode)
	render.JSON(w, r, resp)
	return nil
}

func asDBError(err error) *pgconn.PgError {
	var pgErr *pgconn.PgError
	if errors.As(err, &pgErr) {
		return pgErr
	}
	return nil
}
