package env

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Env struct {
	Environment string
	DbUrl       string
	Port        string
	BasicUser   string
	BasicPass   string
	SupabaseUrl string
	SupabaseKey string
}

func NewEnv() (*Env, error) {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
		log.Printf("defaulting to port %s", port)
	}

	godotenv.Load(".env")
	godotenv.Load()

	env := Env{
		Environment: os.Getenv("ENVIRONMENT"),
		DbUrl:       os.Getenv("DATABASE_URL"),
		Port:        os.Getenv("PORT"),
		BasicUser:   os.Getenv("VITE_BASIC_USER"),
		BasicPass:   os.Getenv("VITE_BASIC_PASS"),
		SupabaseUrl: os.Getenv("VITE_SUPABASE_URL"),
		SupabaseKey: os.Getenv("VITE_SUPABASE_KEY"),
	}

	return &env, nil
}

func (e *Env) IsProduction() bool {
	return e.Environment == "production"
}
