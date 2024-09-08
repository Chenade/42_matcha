package users

import (
	// "fmt"
	"encoding/json"
	"net/http"
	"goji.io/pat"

)

// get by id
func GetInfo(w http.ResponseWriter, r *http.Request) {
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

/** Start of auth required routes **/

// update by id
func Update(w http.ResponseWriter, r *http.Request) {
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

// update image by id
func UploadImage(w http.ResponseWriter, r *http.Request) {
	id := pat.Param(r, "id")

	if id == "" {
		http.Error(w, "id is required", http.StatusBadRequest)
		return
	}

	// Parse the multipart form
	err := r.ParseMultipartForm(10 << 20)
	if err != nil {
		http.Error(w, "Error parsing the form", http.StatusBadRequest)
		return
	}

	// Get the file from the form and check file type is image
	file, handler, err := r.FormFile("image")
	if err != nil {
		http.Error(w, "Error retrieving the file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	if handler.Header.Get("Content-Type") != "image/jpeg" && handler.Header.Get("Content-Type") != "image/png" {
		http.Error(w, "Invalid file type", http.StatusBadRequest)
		return
	}

	UploadImageToUser(w, handler, id)
}

// delete image
func DeleteImage(w http.ResponseWriter, r *http.Request) {
	id := pat.Param(r, "id")

	if id == "" {
		http.Error(w, "id is required", http.StatusBadRequest)
		return
	}

	// err := DeleteImageByUser(id)

	// if err != nil {
	// 	http.Error(w, err.Error(), http.StatusBadRequest)
	// 	return
	// }

	json.NewEncoder(w).Encode("User image deleted successfully")
}