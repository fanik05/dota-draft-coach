package main

import (
	"fmt"
	"log"
	"os"

	"github.com/fanik05/dota-draft-coach/internal/engine"
)

const (
	metaPath = "data/processed_meta.json"
	topN = 10
)

func main() {
	enemies := os.Args[1:]

	if len(enemies) == 0 {
		log.Fatal("usage: draft <enemy_id1> <enemy_id2> ...")
	}

	meta, err := engine.Load(metaPath)

	if err != nil {
		log.Fatalf("load meta: %v", err)
	}

	suggestions := meta.Suggest(enemies)

	fmt.Print("Enemy team: ")

	for i, id := range enemies {
		if i > 0 {
			fmt.Print(", ")
		}

		fmt.Print(meta.Heroes[id].Name)
	}

	fmt.Printf("\n\nTop %d counter picks:\n", topN)

	for i, s := range suggestions {
		if i >= topN {
			break
		}

		hero := meta.Heroes[s.HeroID]
		fmt.Printf("%2d. %-25s %+.4f\n", i + 1, hero.Name, s.Score)
	}


}