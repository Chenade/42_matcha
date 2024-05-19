// handlers/handlers.go

package handlers

import (
	"database/sql"
	"fmt"
	"net/http"

	// "goji.io/pat"
	"api/database/users"
)


func Signup(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	account := r.FormValue("account")
	user := r.FormValue("user")
	email := r.FormValue("email")
	password := r.FormValue("password")
	_, err := db.Exec("insert into users (account, name, email, password) values ($1, $2, $3, $4)", account, user, email, password)
	
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	
	defer db.Close()
	fmt.Fprintf(w, "Signup")
}

func Login(w http.ResponseWriter, r *http.Request, db *sql.DB) {
    account := r.FormValue("account")
    password := r.FormValue("password")

    var found bool
    err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE account = $1 AND password = $2)", account, password).Scan(&found)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    if found {
        fmt.Fprintf(w, "Login success")
    } else {
        http.Error(w, "Login failed", http.StatusBadRequest)
    }
}

func ListUsersHandler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
    users.List(w, r, db)
}