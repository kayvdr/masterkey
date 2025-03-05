package main

import (
	"context"
	"embed"
	"log"
	"net/http"

	"github.com/go-chi/chi"
	chimiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/kayvdr/masterkey/api"
	"github.com/kayvdr/masterkey/common/env"
	"github.com/kayvdr/masterkey/file"
)

//go:embed web/build
var staticFiles embed.FS

func main() {
	env, err := env.NewEnv()
	if err != nil {
		panic(err)
	}

	r := chi.NewRouter()
	r.Use(chimiddleware.RequestID)
	r.Use(chimiddleware.RealIP)
	r.Use(chimiddleware.Maybe(
		chimiddleware.Logger,
		func(r *http.Request) bool { return !env.IsProduction() }),
	)
	r.Use(chimiddleware.Recoverer)
	// The server never sets Etag or Last-Modified headers, so revalidation
	// requests can never be performed. Therefore no-store is used by default to
	// prevent caching.
	r.Use(chimiddleware.SetHeader("Cache-Control", "no-store"))
	r.Use(chimiddleware.Compress(5))

	files, err := file.NewFileServer(staticFiles)
	if err != nil {
		panic(err)
	}

	api, err := api.NewApplication(context.Background(), env)
	if err != nil {
		panic(err)
	}
	defer api.Close()

	r.Mount("/", files.Router())
	r.Mount("/api/v1", api.Router(env))

	log.Printf("listening on port %s", env.Port)
	panic(http.ListenAndServe(":"+env.Port, r))
}
