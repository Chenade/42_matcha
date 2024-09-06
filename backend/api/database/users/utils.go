package users

import (
	"fmt"
	"net/http"
	"regexp"
	"strings"

	"api/database"
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

	// Prepare the response
	returnVal := ""
	for _, usr := range users {
		returnVal += RetunValue(usr) + "\n"
	}

	fmt.Fprintf(w, returnVal)
}

//get by id
func GetById(id string) (User, error) {

	var usr User
	query := "SELECT * FROM users WHERE id = $1"
	err := database.DB.Get(&usr, query, id)
	if err != nil {
		return User{}, fmt.Errorf("User not found")
	}

	return usr, nil
}

// update email, gender, sexual preference, bio
func UpdateById(w http.ResponseWriter, r *http.Request, id string) (User, error) {

	var usr User
	err := database.DB.Get(&usr, "SELECT * FROM users WHERE id = $1", id)
	if err != nil {
		return User{}, fmt.Errorf("User not found")
	}

	var fields []string
	var args []interface{}
	argID := 1

	// Email validation and update
	if email := r.FormValue("email"); email != "" {
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

	// Gender update
	if gender := r.FormValue("gender"); gender != "" {
		if gender != "male" && gender != "female" && gender != "other" {
			return User{}, fmt.Errorf("invalid gender value")
		}
		usr.Gender = gender
		fields = append(fields, fmt.Sprintf("gender = $%d", argID))
		args = append(args, usr.Gender)
		argID++
	}

	// Sexual preference update
	if sexualPreference := r.FormValue("sexual_preference"); sexualPreference != "" {
		usr.SexualPreference = sexualPreference
		fields = append(fields, fmt.Sprintf("sexual_perference = $%d", argID))
		args = append(args, usr.SexualPreference)
		argID++
	}

	// Bio update
	if bio := r.FormValue("bio"); bio != "" {
		usr.Bio = &bio
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


