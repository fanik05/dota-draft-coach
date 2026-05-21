package main

import (
	"log"
	"net/http"
	"os"

	"github.com/fanik05/dota-draft-coach/internal/api"
	"github.com/fanik05/dota-draft-coach/internal/engine"
)

func main() {
	metaPath := os.Getenv("META_PATH")
	if metaPath == "" {
		metaPath = "data/processed_meta.json"
	}

	meta, err := engine.Load(metaPath)
	if err != nil {
		log.Fatalf("load meta: %v", err)
	}
	log.Printf("loaded %d heroes, %d advantage maps", len(meta.Heroes), len(meta.Advantages))

	addr := os.Getenv("ADDR")
	if addr == "" {
		addr = ":8080"
	}

	mux := http.NewServeMux()
	api.RegisterRoutes(mux, &api.Server{Meta: meta})

	log.Printf("listening on %s", addr)
	log.Fatal(http.ListenAndServe(addr, mux))
}
