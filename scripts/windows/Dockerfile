# Use an official Golang image as a base
FROM golang:1.21

# Install dependencies for cross-compiling
RUN apt-get update && apt-get install -y \
    mingw-w64 \
    gcc-mingw-w64-x86-64 \
    gcc-mingw-w64-i686 \
    pkg-config \
    curl

# Install Node.js and npm
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

# Set the working directory
WORKDIR /app

# Copy the Go modules manifests
COPY go.mod go.sum ./

# Download all dependencies. Dependencies will be cached if the go.mod and go.sum files are not changed
RUN go mod download

# Copy the source code
COPY . .

# Install Wails
RUN go install github.com/wailsapp/wails/v2/cmd/wails@latest

# Build the frontend
RUN cd frontend && npm install && npm run build

# Cross-compile for Windows
RUN GOOS=windows GOARCH=amd64 CC=x86_64-w64-mingw32-gcc CXX=x86_64-w64-mingw32-g++ CGO_ENABLED=1 wails build -platform windows/amd64

# Ensure build output directory is present
RUN mkdir -p /output

# Define the output directory
VOLUME ["/output"]

# Copy the build output to the output directory
CMD ["cp", "-r", "/app/build/bin/*", "/output"]
