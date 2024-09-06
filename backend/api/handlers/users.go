package handlers

import (
	"encoding/json"
	"net/http"
	"goji.io/pat"

	users "api/database/users"
)

// get by id
func GetUserById(w http.ResponseWriter, r *http.Request) {
	id := pat.Param(r, "id")

	if id == "" {
		http.Error(w, "id is required", http.StatusBadRequest)
		return
	}

	usr, err := users.GetById(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(usr)
}

// update by id
func UpdateUserById(w http.ResponseWriter, r *http.Request) {
	id := pat.Param(r, "id")

	if id == "" {
		http.Error(w, "id is required", http.StatusBadRequest)
		return
	}

	_, err := users.UpdateById(w, r, id)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	json.NewEncoder(w).Encode("User updated successfully")
}
