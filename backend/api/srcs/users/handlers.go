package users

import (
	// "fmt"
	"encoding/json"
	"net/http"
	"goji.io/pat"
	"strconv"

	data "api/srcs/data"

)

func Profile(w http.ResponseWriter, r *http.Request) {
	usr_id, err := strconv.Atoi(r.Header.Get("usrId"))
	if err != nil {
		http.Error(w, "Invalid usrId", http.StatusBadRequest)
		return
	}	

	usr, err := GetById(strconv.Itoa(usr_id))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(usr)
}

// get by id
func GetInfo(w http.ResponseWriter, r *http.Request) {
	usrId := pat.Param(r, "usrId")

	if usrId == "" {
		http.Error(w, "usrId is required", http.StatusBadRequest)
		return
	}

	usr, err := GetById(usrId)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	err = data.AddViewRecord(w, r, usrId)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	
	json.NewEncoder(w).Encode(usr)
}

/** Start of auth required routes **/

// update by id
func Update(w http.ResponseWriter, r *http.Request) {
	usrId := r.Header.Get("usrId")

	var _usr User
	err := json.NewDecoder(r.Body).Decode(&_usr)
    if err != nil {
        http.Error(w, "Invalid JSON body", http.StatusBadRequest)
        return
    }

	_, err = UpdateById(_usr, usrId)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	json.NewEncoder(w).Encode("User updated successfully")
}

// update image by id
func UploadImage(w http.ResponseWriter, r *http.Request) {
	usrId := r.Header.Get("usrId")

	if usrId == "" {
		http.Error(w, "usrId is required", http.StatusBadRequest)
		return
	}

	var pictures []UserPicture
	pictures, err := getImageByUser(usrId)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if len(pictures) >= 5 {
		http.Error(w, "Maximum number of images reached", http.StatusBadRequest)
		return
	}

	// Parse the multipart form
	err = r.ParseMultipartForm(10 << 20)
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

	err = UploadImageToUser(w, handler, usrId)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode("Image uploaded successfully")
}

// delete image
func DeleteImage(w http.ResponseWriter, r *http.Request) {
	usrId := r.Header.Get("usrId")
	imgId := r.URL.Query().Get("imgId")

	if usrId == "" || imgId == "" {
		http.Error(w, "userId and imgId are required", http.StatusBadRequest)
		return
	}

	err := DeleteImageByUser(imgId, usrId)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	json.NewEncoder(w).Encode("User image deleted successfully")
}