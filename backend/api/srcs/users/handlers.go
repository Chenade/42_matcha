package users

import (
	// "fmt"
	"encoding/json"
	"net/http"
	"goji.io/pat"

)

// get by id
func GetUserById(w http.ResponseWriter, r *http.Request) {
	id := pat.Param(r, "id")

	if id == "" {
		http.Error(w, "id is required", http.StatusBadRequest)
		return
	}

	usr, err := GetById(id)
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

	var _usr User
	err := json.NewDecoder(r.Body).Decode(&_usr)
    if err != nil {
        http.Error(w, "Invalid JSON body", http.StatusBadRequest)
        return
    }

	_, err = UpdateById(_usr, id)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	json.NewEncoder(w).Encode("User updated successfully")
}
