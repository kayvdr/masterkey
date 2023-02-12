package env

import (
	"os"

	"github.com/joho/godotenv"
)

type Env struct {
	PostgresDb        string
	PostgresUser         string
	PostgresPassword        string
	DbUrl        string
	Port         string
}

func NewEnv() *Env {

	godotenv.Load(".env")
	godotenv.Load()

	return &Env{
		PostgresDb:        os.Getenv("POSTGRES_DB"),
		PostgresUser:         os.Getenv("POSTGRES_USER"),
		PostgresPassword:        os.Getenv("POSTGRES_PASSWORD"),
		DbUrl:        os.Getenv("DATABASE_URL"),
		Port:         os.Getenv("PORT"),
	}
}
