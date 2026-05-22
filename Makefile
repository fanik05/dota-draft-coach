.PHONY: setup scrape build run process draft run-frontend

setup:
	@echo "Setting up environments..."
	cd scripts && uv sync
	cd backend && go mod tidy
	cd frontend && npm install

scrape:
	@echo "Extracting data from OpenDota..."
	cd scripts && uv run harvester.py

run-backend:
	@echo "Starting Go Draft Engine..."
	cd backend && go run ./cmd/server

process:
	@echo "Processing raw data..."
	cd scripts && uv run processor.py

draft:
	@echo "Running draft CLI..."
	cd backend && go run ./cmd/draft $(ARGS)

run-frontend:
	@echo "Starting frontend dev server..."
	cd frontend && npm run dev
