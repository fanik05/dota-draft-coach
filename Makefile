.PHONY: setup scrape build run

setup:
	@echo "Setting up environments..."
	cd scripts && uv sync
	cd backend && go mod tidy

scrape:
	@echo "Extracting data from OpenDota..."
	cd scripts && uv run harvester.py

run-backend:
	@echo "Starting Go Draft Engine..."
	cd backend && go run ./cmd/server
