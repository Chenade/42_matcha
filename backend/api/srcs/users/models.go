package users

import (
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"regexp"
	"strings"

	"api/database"
	Interest "api/srcs/interests"
)

func validemail(email string) bool {
	if len(email) < 3 || len(email) > 254 {
		return false
	}
	const emailRegex = `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
	re := regexp.MustCompile(emailRegex)
	return re.MatchString(email)
}


func List(w http.ResponseWriter, r *http.Request) {
    // Fetch all users from the database
    var users []User
    err := database.DB.Select(&users, "SELECT * FROM users")
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    returnValJson, _ := json.Marshal(users)
    fmt.Fprint(w, string(returnValJson))
}

//get by id
func GetById(id string) (User, error) {

	var usr User
	// get the user by id and join the user_pictures table
	err := database.DB.Get(&usr, "SELECT * FROM users WHERE id = $1", id)
	if err != nil {
		return User{}, fmt.Errorf("User not found")
	}

	// get the user pictures
	usr.Pictures, err = getImageByUser(id)
	if err != nil {
		return User{}, err
	}

	// get the user interests
	usr.Interests, err = Interest.ListByUser(id)
	if err != nil {
		return User{}, err
	}
	return usr, nil
}

func getImageByUser(id string) ([]UserPicture, error) {
	var pictures []UserPicture
	err := database.DB.Select(&pictures, "SELECT * FROM user_pictures WHERE user_id = $1", id)
	if err != nil {
		return []UserPicture{}, err
	}
	return pictures, nil
}

// update email, gender, sexual preference, bio
func UpdateById(_usr User, id string) (User, error) {

	var usr User
	err := database.DB.Get(&usr, "SELECT * FROM users WHERE id = $1", id)
	if err != nil {
		return User{}, fmt.Errorf("User not found")
	}

	var fields []string
	var args []interface{}
	argID := 1

	// Email validation and update
	if email := _usr.Email; email != "" {
		if !validemail(email) {
			return User{}, fmt.Errorf("invalid email value")
		}
		var emailExists bool
		err = database.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE email = $1 AND id != $2)", email, id).Scan(&emailExists)
		if err != nil {
			return User{}, err
		}
		if emailExists {
			return User{}, fmt.Errorf("email already exists")
		}
		usr.Email = email
		usr.IsEmailVerify = false
		fields = append(fields, fmt.Sprintf("email = $%d", argID))
		args = append(args, usr.Email)
		argID++
		fields = append(fields, fmt.Sprintf("isemailverify = $%d", argID))
		args = append(args, usr.IsEmailVerify)
		argID++
	}

	// Username update
	if username := _usr.Username; username != "" {
		var usernameExists bool
		err = database.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE username = $1 AND id != $2)", username, id).Scan(&usernameExists)
		if err != nil {
			return User{}, err
		}
		usr.Username = username
		fields = append(fields, fmt.Sprintf ("username = $%d", argID))
		args = append(args, usr.Username)
		argID++
	}

	// Gender update
	if gender := _usr.Gender; gender != "" {
		if gender != "male" && gender != "female" && gender != "other" {
			return User{}, fmt.Errorf("invalid gender value")
		}
		usr.Gender = gender
		fields = append(fields, fmt.Sprintf("gender = $%d", argID))
		args = append(args, usr.Gender)
		argID++
	}

	// Sexual preference update
	if sexualPreference := _usr.SexualPreference; sexualPreference != "" {
		usr.SexualPreference = sexualPreference
		fields = append(fields, fmt.Sprintf("sexual_perference = $%d", argID))
		args = append(args, usr.SexualPreference)
		argID++
	}

	// first name update
	if firstName := _usr.FirstName; firstName != "" {
		usr.FirstName = firstName
		fields = append(fields, fmt.Sprintf("first_name = $%d", argID))
		args = append(args, usr.FirstName)
		argID++
	}

	// last name update
	if lastName := _usr.LastName; lastName != "" {
		usr.LastName = lastName
		fields = append(fields, fmt.Sprintf("last_name = $%d", argID))
		args = append(args, usr.LastName)
		argID++
	}

	// Bio update
	if bio := _usr.Bio; bio != nil {
		usr.Bio = bio
		fields = append(fields, fmt.Sprintf("bio = $%d", argID))
		args = append(args, usr.Bio)
		argID++
	}

	if len(fields) == 0 {
		return User{}, fmt.Errorf("no fields to update")
	}

	query := fmt.Sprintf("UPDATE users SET %s WHERE id = $%d", strings.Join(fields, ", "), argID)
	args = append(args, id)

	_, err = database.DB.Exec(query, args...)
	if err != nil {
		return User{}, err
	}

	return usr, nil
}

// update image by id
func UploadImageToUser(w http.ResponseWriter, img *multipart.FileHeader, id string) error {
	// Check if the user exists
	var usr User
	err := database.DB.Get(&usr, "SELECT * FROM users WHERE id = $1", id)
	if err != nil {
		return fmt.Errorf("User not found")
	}

	file, err := img.Open()
	if err != nil {
		return fmt.Errorf("error retrieving the file")
	}
	defer file.Close()

	dst, err := os.Create(fmt.Sprintf("images/%s", img.Filename))
	if err != nil {
		fmt.Println(err)
		return fmt.Errorf("error creating the file")
	}
	defer dst.Close()

	_, err = io.Copy(dst, file)
	if err != nil {
		return fmt.Errorf("error copying the file")
	}

	_, err = database.DB.Exec("INSERT INTO user_pictures (user_id, path) VALUES ($1, $2)", id, img.Filename)
	if err != nil {
		return err
	}

	return nil
}

// delete image by id
func DeleteImageByUser(imgId, userId string) error {
	var img UserPicture
	err := database.DB.Get(&img, "SELECT * FROM user_pictures WHERE id = $1 AND user_id = $2", imgId, userId)
	if err != nil {
		return fmt.Errorf("Image not found")
	}

	_, err = database.DB.Exec("DELETE FROM user_pictures WHERE id = $1", imgId)
	if err != nil {
		return err
	}
	
	err = os.Remove(fmt.Sprintf("images/%s", img.Path))
	if err != nil {
		return err
	}

	return nil
}


