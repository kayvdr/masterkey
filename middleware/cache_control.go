package middleware

import (
	"fmt"
	"net/http"
	"path"
	"time"
)

var defaultExtensions = []string{
	".svg", ".js", ".css",
}

func CacheControl(expiration time.Duration, extensions ...string) func(next http.Handler) http.Handler {
	allowedTypes := make(map[string]struct{})

	for _, t := range append(defaultExtensions, extensions...) {
		allowedTypes[t] = struct{}{}
	}

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ext := path.Ext(r.URL.Path)

			if _, ok := allowedTypes[ext]; ok {
				w.Header().Set("Cache-Control", fmt.Sprintf("public, max-age=%d, immutable", int(expiration.Seconds())))
			}

			next.ServeHTTP(w, r)
		})
	}
}
