package errorreporting

import (
	"context"
	"log"
	"net/http"
	"os"
	"runtime/debug"

	"cloud.google.com/go/compute/metadata"
	googleErrorReporting "cloud.google.com/go/errorreporting"
)

type Client struct {
	client errorReportingClient
}

type Entry struct {
	Error error
	Req   *http.Request
}

type errorReportingClient interface {
	Report(e Entry)
	Close() error
}

func NewClient(ctx context.Context) Client {
	serviceName := os.Getenv("K_SERVICE")
	var client errorReportingClient

	if serviceName != "" {
		var err error
		client, err = newGoogleErrorReportingClient(ctx, serviceName)
		if err != nil {
			panic(err)
		}
	} else {
		client = newDevClient()
	}

	return Client{client}
}

func newGoogleErrorReportingClient(
	ctx context.Context, serviceName string,
) (errorReportingClient, error) {
	projectID, err := getProjectID(serviceName)
	if err != nil {
		panic(err)
	}

	client, err := googleErrorReporting.NewClient(
		ctx, projectID, googleErrorReporting.Config{
			OnError: func(err error) {
				log.Printf("could not log error: %v", err)
			},
			ServiceName:    serviceName,
			ServiceVersion: os.Getenv("K_REVISION"),
		})
	if err != nil {
		return nil, err
	}

	return newProdClient(client), nil
}

func newDevClient() errorReportingClient {
	var c devClient
	return c
}

type devClient struct{}

func (c devClient) Report(e Entry) {
	log.Println(e.Error)
	debug.PrintStack()
}

func (c devClient) Close() error {
	return nil
}

func newProdClient(c *googleErrorReporting.Client) errorReportingClient {
	return googleClient{c}
}

type googleClient struct {
	client *googleErrorReporting.Client
}

func (c googleClient) Report(e Entry) {
	c.client.Report(googleErrorReporting.Entry{
		Error: e.Error,
		Req:   e.Req,
	})
}

func (c googleClient) Close() error {
	return c.client.Close()
}

func getProjectID(serviceName string) (string, error) {
	if serviceName == "" {
		return "", nil
	}

	return metadata.ProjectID()
}

func (c Client) Report(r *http.Request, err error) {
	c.client.Report(Entry{
		Error: err,
		Req:   r,
	})
}

func (c Client) Close() error {
	return c.client.Close()
}
