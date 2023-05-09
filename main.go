package main

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/on3k/api-test/app"
	"github.com/on3k/api-test/common/env"
)

func main() {
	ctx := context.Background()
	env := env.NewEnv()
	app := app.NewApplication(ctx, env)

	r := chi.NewRouter()

	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Timeout(60 * time.Second))
	r.Use(cors.Handler(cors.Options{
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"Content-Type", "Authorization"},
		MaxAge:         600,
	}))

	r.Route("/v1", func(r chi.Router) {

		r.Group(func(r chi.Router) {
			r.Route("/users", func(r chi.Router) {
				r.Get("/", app.GetUsers)
				r.Post("/", app.CreateUser)
				r.Get("/{userId}", app.GetUser)
				r.Post("/{userId}", app.UpdateUser)
				r.Delete("/{userId}", app.DeleteUser)
				r.Get("/{createdById}/createdBy", app.GetUsersByCreator)
			})
			r.Route("/votes", func(r chi.Router) {
				r.Post("/", app.CreateVote)
				r.Delete("/{voteId}", app.DeleteVote)
			})
		})

		r.Group(func(r chi.Router) {
			r.Route("/platforms", func(r chi.Router) {
				r.Get("/", app.GetPlatforms)
			})
		})
	})

	port := env.Port
	if port == "" {
		port = "8080"
		log.Printf("defaulting to port %s", port)
	}

	log.Printf("listening on port %s", port)
	if err := http.ListenAndServe(":"+port, r); err != nil {
		log.Fatal(err)
	}
}