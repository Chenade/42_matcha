package main

import (
	"fmt"
	"net/http"

	_ "github.com/lib/pq"
	"goji.io"
	"goji.io/pat"

	"api/database"
	"api/handlers"
	"api/middleware"

	ws "api/srcs/websocket"

	users "api/srcs/users"
	interests "api/srcs/interests"
)

func main() {
	//conect to database
	err := database.InitDB()
	if err != nil {
		fmt.Println("Error initializing database:", err)
		return
	}

	//create a new mux
	mux := goji.NewMux()
	mux.Use(middleware.RequestLogger)
	mux.Use(middleware.Https)

	//api routes
	mux.HandleFunc(pat.Get("/"), handlers.Index)
	mux.HandleFunc(pat.Get("/hello/:name"), handlers.HelloName)

	mux.HandleFunc(pat.Get("/users"), handlers.ListUsersHandler)

	mux.HandleFunc(pat.Post("/sign-up"), handlers.SignUp)
	mux.HandleFunc(pat.Post("/login"), handlers.Login)

	mux.HandleFunc(pat.Get("/users/:id"), users.GetInfo)
	mux.HandleFunc(pat.Put("/users/:id"), users.Update)
	mux.HandleFunc(pat.Post("/users/:id/image"), users.UploadImage)
	mux.HandleFunc(pat.Delete("/users/:id/image"), users.DeleteImage)

	mux.HandleFunc(pat.Get("/interests"), interests.ListInterests)
	mux.HandleFunc(pat.Post("/:usrId/interests"), interests.AddToUser)
	mux.HandleFunc(pat.Get("/:usrId/interests"), interests.ListInterestsByUser)
	mux.HandleFunc(pat.Delete("/:usrId/interests"), interests.RemoveFromUser)


	//websocket
	httpMux := http.NewServeMux()
	httpMux.HandleFunc("/ws", ws.WsHandler)
	httpMux.Handle("/", mux)

	port := 3000
	addr := fmt.Sprintf(":%d", port)

	fmt.Printf("Server listening on %d\n", port)
	http.ListenAndServe(addr, httpMux)
}
