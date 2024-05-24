#!/usr/bin/env bash

set -e

# Function to install dependencies for Linux
install_dependencies_linux() {
  sudo apt-get update
  sudo apt-get install -y mingw-w64
}

# Function to install dependencies for macOS
install_dependencies_mac() {
  brew install mingw-w64
}

# Function to install Wails
install_wails() {
  go install -v github.com/wailsapp/wails/v2/cmd/wails@latest
}

# Function to build the project for the specified platform
build_project() {
  local platform=$1
  case $platform in
    windows)
      docker build -f scripts/windows/Dockerfile -t cross-compile-wails .
      docker run --rm -v "$(pwd)/build/bin:/output" cross-compile-wails
      ;;
    mac)
      wails build -platform darwin/amd64
      ;;
    linux)
      wails build -platform linux/amd64
      ;;
    *)
      echo "Unsupported platform: $platform"
      exit 1
      ;;
  esac
}

# Main script execution
main() {
  local platform=$1

  if [[ -z "$platform" ]]; then
    echo "Usage: $0 {windows|mac|linux}"
    exit 1
  fi

  # Install dependencies based on the host OS
  case "$(uname -s)" in
    Linux)
      install_dependencies_linux
      ;;
    Darwin)
      install_dependencies_mac
      ;;
    *)
      echo "Unsupported host OS: $(uname -s)"
      exit 1
      ;;
  esac

  # Install Wails
  install_wails

  # Build the project for the specified platform
  build_project $platform
}

# Run the main function with all the script arguments
main "$@"
