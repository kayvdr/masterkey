package httperr

import (
	"log"
	"net/http"

	"github.com/go-chi/render"
)

type Err struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

type ErrResponse struct {
	Error Err `json:"error"`
}

func (e *ErrResponse) Render(w http.ResponseWriter, r *http.Request) error {
	log.Println(e.Error)
	render.Status(r, e.Error.Code)
	return nil
}

func NewErrResponse(statusCode int) func(message string) render.Renderer {
	return func(message string) render.Renderer {
		return &ErrResponse{
			Error: Err{Code: statusCode, Message: message},
		}
	}
}

var ErrInternalServer = NewErrResponse(http.StatusInternalServerError)

var ErrNotFound = NewErrResponse(http.StatusNotFound)

var ErrUnauthorized = NewErrResponse(http.StatusUnauthorized)

var ErrBadRequest = NewErrResponse(http.StatusBadRequest)

var ErrUnprocessableEntity = NewErrResponse(http.StatusUnprocessableEntity)
