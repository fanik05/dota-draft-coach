.PHONY: setup scrape build run process

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

process:
	@echo "Processing raw data..."
	cd scripts && uv run processor.py
