package users

import (
	"encoding/json"
	"fmt"
	"net/http"
	"regexp"
	"strings"

	"api/database"
	Interest "api/srcs/interests"
	Images "api/srcs/images"
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
	err := database.DB.Get(&usr, "SELECT * FROM users WHERE id = $1", id)
	if err != nil {
		return User{}, fmt.Errorf("User not found")
	}

	usr.Pictures, err = Images.GetImageByUser(id)
	if err != nil {
		return User{}, err
	}

	usr.Interests, err = Interest.ListByUser(id)
	if err != nil {
		return User{}, err
	}
	return usr, nil
}

//get by id and add view record
func GetOthersById(who string, whom string) (OtherUser, error) {

	var usr OtherUser
	err := database.DB.Get(&usr, `
			SELECT 
				users.id,
				users.username,
				users.first_name,
				users.last_name,
				users.location,
				users.fames,
				users.status,
				users.last_time_online,
				users.gender,
				users.sexual_perference,
				users.bio,
				users.profile_picture_id
			FROM users WHERE id = $1`, whom)
	if err != nil {
		println("Error", err)
		return OtherUser{}, fmt.Errorf("User not found")
	}

	usr.Pictures, err = Images.GetImageByUser(whom)
	if err != nil {
		return OtherUser{}, err
	}

	usr.Interests, err = Interest.ListByUser(whom)
	if err != nil {
		return OtherUser{}, err
	}

	if who != "0" {
		_, err = database.DB.NamedExec("INSERT INTO views (who, whom) VALUES (:who, :whom)", map[string]interface{}{
			"who": who,
			"whom": whom,
		})
		
		if err != nil {
			return OtherUser{}, err
		}
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

	// Birthdate update
	if birthdate := _usr.BirthDate; birthdate != nil {
		usr.BirthDate = birthdate
		fields = append(fields, fmt.Sprintf("birth_date = $%d", argID))
		args = append(args, usr.BirthDate)
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


