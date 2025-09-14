.PHONY: help build run stop clean logs dev prod

# Variables
IMAGE_NAME = notes-app
CONTAINER_NAME = notes-app
PORT = 8080

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

build: ## Build Docker image
	docker build -t $(IMAGE_NAME):latest .

run: ## Run container
	docker run -d --name $(CONTAINER_NAME) -p $(PORT):80 $(IMAGE_NAME):latest

stop: ## Stop container
	docker stop $(CONTAINER_NAME) || true
	docker rm $(CONTAINER_NAME) || true

clean: stop ## Clean up containers and images
	docker rmi $(IMAGE_NAME):latest || true
	docker system prune -f

logs: ## View container logs
	docker logs -f $(CONTAINER_NAME)

dev: ## Run development environment
	docker-compose --profile dev up

prod: ## Run production environment
	docker-compose -f docker-compose.prod.yml up -d

shell: ## Enter container shell
	docker exec -it $(CONTAINER_NAME) /bin/sh

restart: stop run ## Restart container

stats: ## Show container stats
	docker stats $(CONTAINER_NAME)