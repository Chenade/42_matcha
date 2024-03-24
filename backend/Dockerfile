FROM golang:latest

# Set the working directory to the root of your project
WORKDIR /app

# Copy the Go modules files
COPY ./api/go.mod ./api/go.sum ./api/
# Change directory to the API directory
WORKDIR /app/api
# Download dependencies
RUN go mod download

# Go back to the root of your project
WORKDIR /app

# Copy the rest of the application
COPY ./api .

# Copy the database migration files
COPY ./database ./database

# Build the Go application
RUN go build -o main .

# Expose the port on which your Go application will run
EXPOSE 3000

# Command to run the executable
CMD ["./main"]
