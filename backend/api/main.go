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
	data "api/srcs/data"
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

	imagesDir := http.FileServer(http.Dir("/usr/src/app/images"))
	mux.Handle(pat.Get("/images/*"), http.StripPrefix("/images/", imagesDir))

	mux.Use(middleware.RequestLogger)
	mux.Use(middleware.Https)
	
	mux.HandleFunc(pat.Get("/"), handlers.Index)
	mux.HandleFunc(pat.Get("/hello/:name"), handlers.HelloName)

	mux.HandleFunc(pat.Get("/users"), handlers.ListUsersHandler)
	mux.HandleFunc(pat.Get("/interests"), interests.ListInterests)
	
	mux.HandleFunc(pat.Post("/sign-up"), handlers.SignUp)
	mux.HandleFunc(pat.Post("/login"), handlers.Login)

	userMux := goji.SubMux()
	userMux.Use(middleware.AuthMiddleware)
	mux.Handle(pat.New("/users/*"), userMux)

	userMux.HandleFunc(pat.Get("/profile"), users.Profile)
	userMux.HandleFunc(pat.Put("/profile"), users.Update)
	userMux.HandleFunc(pat.Get("/profile/:usrId"), users.GetInfo)
	userMux.HandleFunc(pat.Post("/image"), users.UploadImage)
	userMux.HandleFunc(pat.Delete("/image"), users.DeleteImage)

	userMux.HandleFunc(pat.Get("/views"), data.ListViewsByUser)
	
	userMux.HandleFunc(pat.Get("/likes"), data.ListLikesByUser)
	userMux.HandleFunc(pat.Post("/likes/:usrId"), data.AddLikeRecord)
	userMux.HandleFunc(pat.Delete("/likes/:usrId"), data.RemoveLikeRecord)

	
	userMux.HandleFunc(pat.Post("/interests"), interests.AddToUser)
	userMux.HandleFunc(pat.Delete("/interests"), interests.RemoveFromUser)

	//websocket
	httpMux := http.NewServeMux()
	httpMux.HandleFunc("/ws", ws.WsHandler)
	httpMux.Handle("/", mux)

	port := 3000
	addr := fmt.Sprintf(":%d", port)

	fmt.Printf("Server listening on %d\n", port)
	http.ListenAndServe(addr, httpMux)
}
