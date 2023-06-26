package main

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/go-chi/chi"
	chiMiddleware "github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
	"github.com/on3k/shac-api/app"
	"github.com/on3k/shac-api/common/env"
)

func main() {
	ctx := context.Background()
	env := env.NewEnv()
	app := app.NewApplication(ctx, env)

	r := chi.NewRouter()

	r.Use(chiMiddleware.RequestID)
	r.Use(chiMiddleware.RealIP)
	r.Use(chiMiddleware.Logger)
	r.Use(chiMiddleware.Recoverer)
	r.Use(chiMiddleware.Timeout(60 * time.Second))
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{"http://localhost:60005"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"Accept", "Content-Type", "Authorization"},
		MaxAge:         600,
	}))

	r.Route("/v1", func(r chi.Router) {
		r.Route("/users", func(r chi.Router) {
			r.Get("/", app.GetUsers)
			r.Post("/", app.CreateUser)
			r.Get("/{userId}", app.GetUser)
			r.Patch("/{userId}", app.UpdateUser)
			r.Delete("/{userId}", app.DeleteUser)
			r.Get("/{userId}/votes", app.GetUserVotes)
		})

		r.Route("/creators", func(r chi.Router) {
			r.Get("/{creatorId}/users", app.GetCreatorsUsers)
			r.Get("/{creatorId}/votes", app.GetCreatorsVotes)
		})

		r.Route("/platforms", func(r chi.Router) {
			r.Get("/", app.GetPlatforms)
		})

		r.Route("/votes", func(r chi.Router) {
			r.Post("/", app.CreateVote)
			r.Delete("/{voteId}", app.DeleteVote)
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