package supabase

import (
	"context"
	"errors"
	"strings"

	supabase "github.com/lengzuo/supa"
	"github.com/on3k/shac-api/common/env"
)

type Client struct {
	client *supabase.Client
}

func NewClient(env *env.Env) (*Client, error) {
	if env == nil {
		return nil, errors.New("environment variables not initialized")
	}

	if strings.TrimSpace(env.SupabaseUrl) == "" {
		return nil, errors.New("supabase: missing URL")
	}

	if strings.TrimSpace(env.SupabaseKey) == "" {
		return nil, errors.New("supabase: missing api key")
	}

	conf := supabase.Config{
		ApiKey: env.SupabaseKey,
		ProjectRef: env.SupabaseUrl,
		Debug: !env.IsProduction(),
	}

	supaClient, err := supabase.New(conf)
	if err != nil {
		return nil, err
	}

	return &Client{supaClient}, nil
}

func (c *Client) GetUser(ctx context.Context, token string) (error) {
	if token == "" {
		return errors.New("supabase: invalid token")
	}

	_, err := c.client.Auth.User(ctx, token)
	if err != nil {
		return errors.New("supabase: access denied")
	}

	return nil
}