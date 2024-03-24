FROM golang:latest

WORKDIR /api

COPY ./api/go.mod ./api/go.sum ./
# RUN go mod download

COPY ./api .

RUN go build -o main .

EXPOSE 3000

CMD ["./main"]