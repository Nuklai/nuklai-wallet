# Use an official Golang image as a base
FROM golang:1.21

# Install mingw-w64 for cross-compilation
RUN apt-get update && apt-get install -y mingw-w64

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

# Cross-compile for Windows
RUN GOOS=windows GOARCH=amd64 wails build -platform windows/amd64

# Define the output directory
VOLUME ["/app/build/bin"]

# Define the entrypoint command
CMD ["cp", "-r", "/app/build/bin", "/output"]
