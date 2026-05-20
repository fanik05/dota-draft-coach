package engine

import (
	"encoding/json"
	"fmt"
	"os"
)

func Load(path string) (*Meta, error) {
	data, err := os.ReadFile(path)

	if err != nil {
		return  nil, fmt.Errorf("read %s: %w", path, err)
	}

	var meta Meta

	if err := json.Unmarshal(data, &meta); err != nil {
		return nil, fmt.Errorf("unmarshal %s: %w", path, err)
	}

	return  &meta, nil
}