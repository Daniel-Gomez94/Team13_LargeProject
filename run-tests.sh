#!/bin/bash

# UCF Coding Practice - Test Runner Script
# This script helps run tests with various options

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_color() {
    color=$1
    message=$2
    echo -e "${color}${message}${NC}"
}

# Function to print header
print_header() {
    echo ""
    print_color "$BLUE" "=================================="
    print_color "$BLUE" "$1"
    print_color "$BLUE" "=================================="
    echo ""
}

# Function to run frontend tests
run_frontend_tests() {
    print_header "Running Frontend Tests"
    cd frontend
    
    if [ "$1" == "watch" ]; then
        npm run test:watch
    elif [ "$1" == "coverage" ]; then
        npm run test:coverage
        print_color "$GREEN" "✅ Coverage report: frontend/coverage/index.html"
    elif [ "$1" == "ui" ]; then
        npm run test:ui
    else
        npm test -- --run
    fi
    
    cd ..
}

# Function to run backend tests
run_backend_tests() {
    print_header "Running Backend Tests"
    cd backend
    
    if [ "$1" == "watch" ]; then
        npm run test:watch
    elif [ "$1" == "coverage" ]; then
        npm run test:coverage
        print_color "$GREEN" "✅ Coverage report: backend/coverage/index.html"
    else
        npm test
    fi
    
    cd ..
}

# Function to run all tests
run_all_tests() {
    print_header "Running All Tests"
    
    print_color "$YELLOW" "📦 Frontend Tests..."
    run_frontend_tests "$1"
    
    print_color "$YELLOW" "📦 Backend Tests..."
    run_backend_tests "$1"
    
    print_color "$GREEN" "✅ All tests completed!"
}

# Function to install dependencies
install_deps() {
    print_header "Installing Dependencies"
    
    print_color "$YELLOW" "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
    
    print_color "$YELLOW" "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
    
    print_color "$GREEN" "✅ All dependencies installed!"
}

# Function to show help
show_help() {
    echo ""
    print_color "$BLUE" "UCF Coding Practice - Test Runner"
    echo ""
    echo "Usage: ./run-tests.sh [command] [options]"
    echo ""
    echo "Commands:"
    echo "  all              Run all tests (default)"
    echo "  frontend         Run frontend tests only"
    echo "  backend          Run backend tests only"
    echo "  install          Install all dependencies"
    echo "  coverage         Run tests with coverage"
    echo "  help             Show this help message"
    echo ""
    echo "Options:"
    echo "  watch            Run tests in watch mode"
    echo "  ui               Run frontend tests with UI"
    echo ""
    echo "Examples:"
    echo "  ./run-tests.sh                    # Run all tests"
    echo "  ./run-tests.sh frontend           # Run frontend tests"
    echo "  ./run-tests.sh frontend watch     # Run frontend tests in watch mode"
    echo "  ./run-tests.sh coverage           # Run all tests with coverage"
    echo "  ./run-tests.sh frontend ui        # Run frontend tests with UI"
    echo "  ./run-tests.sh install            # Install dependencies"
    echo ""
}

# Main script logic
main() {
    print_color "$GREEN" "🧪 UCF Coding Practice Test Suite"
    
    case "${1:-all}" in
        all)
            run_all_tests "${2}"
            ;;
        frontend)
            run_frontend_tests "${2}"
            ;;
        backend)
            run_backend_tests "${2}"
            ;;
        coverage)
            run_all_tests "coverage"
            print_header "Coverage Summary"
            print_color "$GREEN" "📊 Frontend coverage: frontend/coverage/index.html"
            print_color "$GREEN" "📊 Backend coverage: backend/coverage/index.html"
            ;;
        install)
            install_deps
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_color "$RED" "❌ Unknown command: $1"
            show_help
            exit 1
            ;;
    esac
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_color "$RED" "❌ Error: package.json not found!"
    print_color "$YELLOW" "Please run this script from the project root directory."
    exit 1
fi

# Run main function
main "$@"
