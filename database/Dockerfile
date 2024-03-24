FROM alpine:latest
# Set the working directory
WORKDIR /migrations

# Install any additional dependencies (if needed)

# Copy the entire migrations directory into the container
COPY ./migrations /migrations

# Copy the migrate binary into the container
COPY ./migrate /migrate

# Make the migrate binary executable
RUN chmod +x /migrate

# Run the migrations when the container starts
CMD ["sh", "-c", "/migrate -path /migrations -database 'postgres://postgres:123@postgres:5432/postgres?sslmode=disable' up"]
