FROM golang:1.22-alpine AS base
WORKDIR /app

FROM base AS development
# Necessary for working inside the HGV network
RUN apk add build-base tzdata --no-cache
# Create external debugger
RUN go install github.com/go-delve/delve/cmd/dlv@latest
# Restart server on code change
RUN go install github.com/cespare/reflex@latest
COPY reflex.conf /
ENTRYPOINT ["reflex", "-c", "/reflex.conf"]

FROM node:20-alpine as node-builder
# Necessary for working inside the HGV network
WORKDIR /app
# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY web/package*.json ./
RUN npm ci
COPY web .
RUN npm run build

FROM base AS go-builder
# Retrieve application dependencies.
# This allows the container build to reuse cached dependencies.
# Expecting to copy go.mod and if present go.sum.
COPY go.* ./
RUN go mod download
# Copy local code to the container image.
COPY . .
COPY --from=node-builder /app/dist /app/web/dist
WORKDIR /app
# Build the binary.
RUN go build -buildvcs=false -v -o server


FROM alpine:latest
RUN apk add --no-cache tzdata
# Copy the binary to the production image from the builder stage.
COPY --from=go-builder /app/server /app/server
# Run the web service on container startup.
CMD ["/app/server"]
