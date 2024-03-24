package main

import (
	"fmt"
	"net/http"

	"goji.io"
	"goji.io/pat"

	"api/handlers"
	"api/middleware"
	"api/utils"
)

func main() {
	mux := goji.NewMux()

	mux.Use(middleware.RequestLogger)

	mux.HandleFunc(pat.Get("/"), handlers.Index)
	mux.HandleFunc(pat.Get("/hello/:name"), handlers.HelloName)

	port := 3000
	addr := fmt.Sprintf("0.0.0.0:%d", port)

	utils.Log(fmt.Sprintf("Server running on port %d", port))

	http.ListenAndServe(addr, mux)
}
