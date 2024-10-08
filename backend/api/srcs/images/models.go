package images

import (
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"

	"api/database"
	"github.com/google/uuid"

)

func GetImageByUser(id string) ([]UserPicture, error) {
	var pictures []UserPicture
	err := database.DB.Select(&pictures, "SELECT id, path FROM user_pictures WHERE user_id = $1", id)
	if err != nil {
		return []UserPicture{}, err
	}
	return pictures, nil
}

func GetById(id string) (string, error) {
	var img UserPicture
	err := database.DB.Get(&img, "SELECT path FROM user_pictures WHERE id = $1", id)
	if err != nil {
		return "", fmt.Errorf("image not found")
	}
	return img.Path, nil
}

// update image by id
func UploadImageToUser(w http.ResponseWriter, img *multipart.FileHeader, id string) error {
	file, err := img.Open()
	if err != nil {
		return fmt.Errorf("error retrieving the file")
	}
	defer file.Close()

	if _, err := os.Stat("/usr/src/app/uploads"); os.IsNotExist(err) {
		os.Mkdir("/usr/src/app/uploads", 0755)
	}

	fileID := uuid.New().String()
	dst, err := os.Create(fmt.Sprintf("/usr/src/app/uploads/%s", fileID))
	if err != nil {
		fmt.Println(err)
		return fmt.Errorf("error creating the file")
	}
	defer dst.Close()

	_, err = io.Copy(dst, file)
	if err != nil {
		return fmt.Errorf("error copying the file")
	}

	_, err = database.DB.Exec("INSERT INTO user_pictures (user_id, path) VALUES ($1, $2)", id, fileID)
	if err != nil {
		return err
	}

	return nil
}

// delete image by id
func DeleteImageByUser(imgId, userId string) error {
	var img UserPicture
	err := database.DB.Get(&img, "SELECT  id, path FROM user_pictures WHERE id = $1 AND user_id = $2", imgId, userId)
	if err != nil {
		return fmt.Errorf("image not found")
	}

	var profileID string
	err = database.DB.Get(&profileID, "SELECT profile_picture_id FROM users WHERE id = $1", userId)
	if err != nil {
		return err
	}

	if profileID == imgId {
		return fmt.Errorf("cannot delete profile picture")
	}
	
	_, err = database.DB.Exec("DELETE FROM user_pictures WHERE id = $1", imgId)
	if err != nil {
		return err
	}
	
	err = os.Remove(fmt.Sprintf("/usr/src/app/uploads/%s", img.Path))
	if err != nil {
		return err
	}

	return nil
}

func UpdateProfile(imgId, userId string) error {
	var img UserPicture
	err := database.DB.Get(&img, "SELECT  id, path FROM user_pictures WHERE id = $1 AND user_id = $2", imgId, userId)
	if err != nil {
		return fmt.Errorf("image not found")
	}

	_, err = database.DB.Exec("UPDATE users SET profile_picture_id = $1 WHERE id = $2", imgId, userId)
	if err != nil {
		return err
	}

	return nil
}