package common

import (
	"fmt"
	"net/http"

	"github.com/go-chi/chi"
	"github.com/google/uuid"
)

func GetUUIDParamFromURL(r *http.Request, param string) (uuid.UUID, error) {
	paramData := chi.URLParam(r, param)
	if paramData == "" {
		return uuid.Nil, fmt.Errorf("missing parameter %s", param)
	}
	value, err := uuid.Parse(paramData)
	if err != nil {
		return uuid.Nil, fmt.Errorf("invalid parameter %s", param)
	}

	return value, nil
}

func Append(record []string, value *string) []string {
	if value != nil {
		record = append(record, *value)
	} else {
		record = append(record, "")
	}

	return record
}

func Contains(array []string, value string) bool {
	for _, item := range array {
		if item == value {
			return true
		}
	}
	return false
}
