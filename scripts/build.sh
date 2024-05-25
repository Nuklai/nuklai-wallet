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

# Function to install Wails locally
install_wails() {
  go install -v github.com/wailsapp/wails/v2/cmd/wails@latest
}

# Function to build the frontend
build_frontend() {
  (cd frontend && npm install && npm run build)
}

# Function to generate bindings
generate_bindings() {
  wails generate bindings
}

# Function to build the project for the specified platform
build_project() {
  local platform=$1
  case $platform in
    windows)
      # Ensure bindings are generated
      generate_bindings

      # Build Docker image and run container for cross-compilation
      docker build -t cross-compile-wails .
      docker run --rm -v "$(pwd)/output:/output" cross-compile-wails
      ;;
    mac)
      if [[ "$(uname -s)" != "Darwin" ]]; then
        echo "Cannot build for macOS on a non-macOS system."
        exit 1
      fi
      build_frontend
      wails build -platform darwin/amd64
      package_mac
      ;;
    linux)
      build_frontend
      wails build -platform linux/amd64
      ;;
    *)
      echo "Unsupported platform: $platform"
      exit 1
      ;;
  esac
}

# Function to create a DMG package for macOS using appdmg
package_mac() {
  local app_name="Nuklai Wallet"
  local build_dir="build/bin"
  local dmg_dir="build/dmg"
  local dmg_config="scripts/mac/appdmg.json"

  mkdir -p "${dmg_dir}"

  # Install appdmg if not already installed
  if ! command -v appdmg &> /dev/null; then
    echo "appdmg could not be found, installing..."
    npm install -g appdmg
  fi

  # Create the DMG using appdmg
  appdmg "${dmg_config}" "${dmg_dir}/${app_name}.dmg"
}

# Main script execution
main() {
  local platform=$1

  if [[ -z "$platform" ]]; then
    echo "Usage: $0 {windows|mac|linux}"
    exit 1
  fi

  # Only install local dependencies if we are not building for Windows
  if [[ "$platform" != "windows" ]]; then
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

    # Install Wails locally
    install_wails
  fi

  # Build the project for the specified platform
  build_project $platform
}

# Run the main function with all the script arguments
main "$@"
