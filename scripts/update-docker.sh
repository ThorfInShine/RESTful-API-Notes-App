#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="ghcr.io/thorfinshine/restful-api-notes-app:latest"
CONTAINER_NAME="notes-app"
PORT="8080:80"
COMPOSE_FILE="docker-compose.yml"

echo -e "${BLUE}🚀 Notes App Docker Update Script${NC}"
echo -e "${YELLOW}======================================${NC}"

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
        exit 1
    fi
}

# Function to check if container exists
container_exists() {
    docker ps -a --format "table {{.Names}}" | grep -q "^${CONTAINER_NAME}$"
}

# Function to check if container is running
container_running() {
    docker ps --format "table {{.Names}}" | grep -q "^${CONTAINER_NAME}$"
}

# Function to get current image ID
get_current_image_id() {
    docker images --format "table {{.ID}}" ${IMAGE_NAME} | tail -n +2 | head -n 1
}

# Main update function
main() {
    echo -e "${YELLOW}🔍 Checking Docker status...${NC}"
    check_docker
    
    echo -e "${YELLOW}📋 Current status:${NC}"
    if container_exists; then
        if container_running; then
            echo -e "   Container: ${GREEN}Running${NC}"
        else
            echo -e "   Container: ${YELLOW}Stopped${NC}"
        fi
    else
        echo -e "   Container: ${RED}Not found${NC}"
    fi
    
    # Get current image ID before update
    CURRENT_IMAGE=$(get_current_image_id)
    echo -e "   Current Image ID: ${CURRENT_IMAGE:-'None'}"
    
    echo -e "\n${YELLOW}⬇️  Pulling latest image...${NC}"
    if docker pull $IMAGE_NAME; then
        echo -e "${GREEN}✅ Successfully pulled latest image${NC}"
    else
        echo -e "${RED}❌ Failed to pull latest image${NC}"
        exit 1
    fi
    
    # Check if image was updated
    NEW_IMAGE=$(get_current_image_id)
    if [ "$CURRENT_IMAGE" = "$NEW_IMAGE" ] && [ -n "$CURRENT_IMAGE" ]; then
        echo -e "${BLUE}ℹ️  No new image available. Current image is up to date.${NC}"
        if container_running; then
            echo -e "${GREEN}✅ Container is already running with latest image${NC}"
            echo -e "${GREEN}🌐 Application available at: http://localhost:8080${NC}"
            return
        fi
    fi
    
    # Stop and remove existing container
    if container_exists; then
        echo -e "${YELLOW}🛑 Stopping existing container...${NC}"
        docker stop $CONTAINER_NAME
        
        echo -e "${YELLOW}🗑️  Removing existing container...${NC}"
        docker rm $CONTAINER_NAME
    fi
    
    # Run new container
    echo -e "${YELLOW}🚀 Starting new container...${NC}"
    if docker run -d \
        --name $CONTAINER_NAME \
        --restart unless-stopped \
        -p $PORT \
        $IMAGE_NAME; then
        echo -e "${GREEN}✅ Container started successfully${NC}"
        echo -e "${GREEN}🌐 Application available at: http://localhost:8080${NC}"
    else
        echo -e "${RED}❌ Failed to start container${NC}"
        exit 1
    fi
    
    # Clean up old images
    echo -e "${YELLOW}🧹 Cleaning up old images...${NC}"
    docker image prune -f
    
    # Show container status
    echo -e "\n${BLUE}📊 Container Status:${NC}"
    docker ps --filter "name=${CONTAINER_NAME}" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    
    echo -e "\n${GREEN}🎉 Docker update completed successfully!${NC}"
}

# Handle script arguments
case "${1:-}" in
    "compose")
        echo -e "${YELLOW}🐳 Using Docker Compose method...${NC}"
        if [ -f "$COMPOSE_FILE" ]; then
            docker-compose pull notes-app
            docker-compose up -d notes-app
        else
            echo -e "${RED}❌ docker-compose.yml not found${NC}"
            exit 1
        fi
        ;;
    "watchtower")
        echo -e "${YELLOW}👁️  Starting with Watchtower auto-update...${NC}"
        docker-compose --profile auto-update up -d
        ;;
    "help"|"-h"|"--help")
        echo -e "${BLUE}Usage:${NC}"
        echo -e "  $0              - Manual update (default)"
        echo -e "  $0 compose      - Update using docker-compose"
        echo -e "  $0 watchtower   - Start with auto-update enabled"
        echo -e "  $0 help         - Show this help"
        ;;
    *)
        main
        ;;
esac