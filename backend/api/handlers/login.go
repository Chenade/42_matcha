package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"

	"api/database"
	users "api/srcs/users"
	utils "api/utils"
)

type UserRegistration struct {
	Email     string `json:"email"`
	Username  string `json:"username"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Password  string `json:"password"`
}

func SignUp(w http.ResponseWriter, r *http.Request) {
	log.Println("Sign up handler called, request:", r)
	bytedata, _ := io.ReadAll(r.Body)
	reqBodyString := string(bytedata)
	// create a bodyOBject of type UserRegistration
	var bodyObject UserRegistration
	// Unmarshal or Decode the JSON to the interface.
	json.Unmarshal(bytedata, &bodyObject)
	fmt.Println(reqBodyString)

	email := bodyObject.Email
	username := bodyObject.Username
	first_name := bodyObject.FirstName
	last_name := bodyObject.LastName
	password := bodyObject.Password
	// Todo: check if email, username already exists
	// Todo: hash password
	// Todo: send email verification
	_, err := database.DB.Exec(`insert into users (email, username, first_name, last_name, password) values ($1, $2, $3, $4, $5)`, email, username, first_name, last_name, password)

	fmt.Println("email:", email)
	fmt.Println("username:", username)
	fmt.Println("first_name:", first_name)
	if err != nil {
		log.Println("Error inserting user:", err)
		http.Error(w, err.Error(), 500)
		return
	}

	fmt.Println("User created")
	w.Write([]byte("User created"))
}

func Login(w http.ResponseWriter, r *http.Request) {
	user_email := r.FormValue("email")
	password := r.FormValue("password")

	var userID *int
	err := database.DB.QueryRow("SELECT id FROM users WHERE email = $1 AND password = $2", user_email, password).Scan(&userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if userID != nil {
		jwtToken, err := utils.GenerateToken(*userID)
		if err != nil {
			log.Println("Error generating token:", err)
			http.Error(w, "Error generating token", http.StatusInternalServerError)
			return
		}
		http.Header.Add(w.Header(), "Authorization", jwtToken)
		w.Write([]byte("Login success"))
	} else {
		log.Println(w, "Login failed")
		http.Error(w, "Login failed", http.StatusBadRequest)
	}
}

func ListUsersHandler(w http.ResponseWriter, r *http.Request) {
	users.List(w, r)
}
