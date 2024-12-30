package middleware

import (
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

var SecurityHeaders = chi.Chain(
	middleware.SetHeader("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'"),
	middleware.SetHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains"),
	middleware.SetHeader("X-Content-Type-Options", "nosniff"),
	middleware.SetHeader("Referrer-Policy", "no-referrer-when-downgrade"),
)
