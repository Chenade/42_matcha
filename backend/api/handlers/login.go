// handlers/handlers.go

package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	// "goji.io/pat"
	"api/database"
	users "api/database/users"
)

type UserRegistration struct {
	Email     string `json:"email"`
	Username  string `json:"username"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Password  string `json:"password"`
}

func SignUp(w http.ResponseWriter, r *http.Request) {
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
		http.Error(w, err.Error(), 500)
		return
	}

	fmt.Fprintf(w, "Signup")
}

func Login(w http.ResponseWriter, r *http.Request) {
	username_or_email := r.FormValue("account")
	password := r.FormValue("password")

	var found bool
	err := database.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE (account = $1 OR email = $1) AND password = $2)", username_or_email, password).Scan(&found)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if found {
		fmt.Fprintf(w, "Login success")
		// Todo: create session
	} else {
		http.Error(w, "Login failed", http.StatusBadRequest)
	}
}

func ListUsersHandler(w http.ResponseWriter, r *http.Request) {
	users.List(w, r)
}
