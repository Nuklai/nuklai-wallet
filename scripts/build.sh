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

# Function to build the project for the specified platform
build_project() {
  local platform=$1
  case $platform in
    windows)
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

# Function to create a package for macOS
package_mac() {
  local app_name="Nuklai Wallet"
  local build_dir="build/bin"
  local pkg_dir="build/pkg"
  local scripts_dir="scripts/mac"
  local dist_file="${scripts_dir}/distribution.xml"

  mkdir -p "${pkg_dir}"

  # Create the component package
  pkgbuild --root "${build_dir}/${app_name}.app" \
           --identifier "ai.nukl.nuklaiwallet" \
           --install-location "/Applications" \
           "${pkg_dir}/nuklai-wallet.pkg"

  # Create the product archive
  productbuild --distribution "${dist_file}" \
               --package-path "${pkg_dir}/nuklai-wallet.pkg" \
               --resources "${scripts_dir}" \
               "${pkg_dir}/Nuklai_Wallet_Installer.pkg"
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
