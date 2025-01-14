package file

import (
	"io/fs"
	"net/http"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	chimiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/kayvdr/masterkey/middleware"
)

type FileServer struct {
	dist fs.FS
}

func NewFileServer(static fs.FS) (*FileServer, error) {
	dist, err := fs.Sub(static, "web/dist")
	if err != nil {
		return nil, err
	}

	return &FileServer{
		dist: dist,
	}, nil
}

func (s *FileServer) Router() http.Handler {
	r := chi.NewRouter()
	r.Use(
		chimiddleware.SetHeader("Content-Security-Policy", strings.Join([]string{
			"default-src 'none'",
			"script-src 'self'",
			"style-src 'self' 'unsafe-inline'",
			"img-src 'self' data:",
			"connect-src 'self' https://*.supabase.co",
			"frame-src 'self'",
			"font-src 'self'",
			"frame-ancestors 'self'"}, ";")),
		middleware.CacheControl(365*24*time.Hour),
	)
	r.Mount("/", middleware.Static(&middleware.StaticConfig{
		FS: http.FS(s.dist),
	}))
	return r
}
