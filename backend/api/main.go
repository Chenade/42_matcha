package main

import (
	// "database/sql"
	"fmt"
	"net/http"

	"goji.io"
	"goji.io/pat"
	_ "github.com/lib/pq"

	"api/database"
	"api/handlers"
	"api/middleware"
	"api/utils"
)

func main() {
	//conect to database
	err := database.InitDB()
	if err != nil {
		fmt.Println("Error initializing database:", err)
		return
	}
	// defer db.Close()

	//create a new mux
	mux := goji.NewMux()
	mux.Use(middleware.RequestLogger)

	//api routes
	mux.HandleFunc(pat.Get("/"), handlers.Index)
	mux.HandleFunc(pat.Get("/hello/:name"), handlers.HelloName)
	
	mux.HandleFunc(pat.Get("/users"), handlers.ListUsersHandler)

	mux.HandleFunc(pat.Post("/signup"), handlers.Signup)
	mux.HandleFunc(pat.Post("/login"), handlers.Login)

	//websocket
	httpMux := http.NewServeMux()
	httpMux.HandleFunc("/ws", handlers.WsHandler)
	httpMux.Handle("/", mux)

	port := 3000
	addr := fmt.Sprintf(":%d", port)

	utils.Log(fmt.Sprintf("Server running on port %d", port))
	http.ListenAndServe(addr, httpMux)
}
