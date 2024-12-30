package middleware

import (
	"errors"
	"io/fs"
	"net/http"
	"path"
)

type StaticConfig struct {
	FS      http.FileSystem
	handler http.Handler
}

func Static(config *StaticConfig) http.Handler {
	config.handler = http.FileServer(config.FS)
	return config
}

func (c *StaticConfig) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	f, err := c.FS.Open(path.Clean(r.URL.Path))
	if errors.Is(err, fs.ErrNotExist) {
		r.URL.Path = "/"
	}
	if f != nil {
		_ = f.Close()
	}
	c.handler.ServeHTTP(w, r)
}
