package users

import (
	"fmt"
	"net/http"
	"regexp"
	"strings"
	"encoding/json"

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

    returnValJson, _ := json.Marshal(users)
    fmt.Fprint(w, string(returnValJson))
}

//get by id
func GetById(id string) (User, error) {

	var usr User
	query := fmt.Sprintf("SELECT * FROM users WHERE id = %s", id)
	err := database.DB.Get(&usr, query, id)
	if err != nil {
		return User{}, fmt.Errorf("User not found")
	}

	return usr, nil
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


