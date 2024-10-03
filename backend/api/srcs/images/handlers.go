package images

import (
	"encoding/json"
	"net/http"
)


// update image by id
func Upload(w http.ResponseWriter, r *http.Request) {
	usrId := r.Header.Get("usrId")

	if usrId == "" {
		http.Error(w, "usrId is required", http.StatusBadRequest)
		return
	}

	var pictures []UserPicture
	pictures, err := GetImageByUser(usrId)
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
func Delete(w http.ResponseWriter, r *http.Request) {
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

// set as profile image
func SetProfile(w http.ResponseWriter, r *http.Request) {
	usrId := r.Header.Get("usrId")
	imgId := r.URL.Query().Get("imgId")

	if usrId == "" || imgId == "" {
		http.Error(w, "userId and imgId are required", http.StatusBadRequest)
		return
	}

	err := UpdateProfile(imgId, usrId)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	json.NewEncoder(w).Encode("Profile image updated successfully")
}

