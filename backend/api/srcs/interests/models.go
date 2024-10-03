package interests

import (
	"encoding/json"
	"fmt"
	"net/http"

	"api/database"
)

func checkInterest(interest string) (int) {
	println(interest)
	var id int
	err := database.DB.Get(&id, "SELECT id FROM interests WHERE name = $1", interest)
	if err != nil {
		return 0
	}

	return id
}

func List(w http.ResponseWriter, r *http.Request) {
	var interests []Interest
	var keyword string
	if r.URL.Query().Get("keyword") != "" {
		keyword = r.URL.Query().Get("keyword")
		err := database.DB.Select(&interests, "SELECT * FROM interests WHERE name LIKE $1 LIMIT 10", "%"+keyword+"%")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	} else {
		err := database.DB.Select(&interests, "SELECT * FROM interests LIMIT 10")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	returnValJson, _ := json.Marshal(interests)
	fmt.Fprint(w, string(returnValJson))
}

// add interest to user
func AddInterest(w http.ResponseWriter, _interest Interest, id string) (bool) {
	interest := _interest.Name

	if interest == "" {
		http.Error(w, "Interest not provided", http.StatusBadRequest)
		return false
	}

	interestID := checkInterest(interest)
	if interestID == 0 {
		_, err := database.DB.Exec("INSERT INTO interests (name) VALUES ($1)", interest)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return false
		}
		interestID = checkInterest(interest)
	}

	// Check if the user already has the interest
	var userInterest UserInterest
	err := database.DB.Get(&userInterest, "SELECT * FROM user_interests WHERE user_id = $1 AND interest_id = $2", id, interestID)
	if err == nil {
		http.Error(w, "User already has the interest", http.StatusBadRequest)
		return false
	}

	// Add the interest to the user
	_, err = database.DB.Exec("INSERT INTO user_interests (user_id, interest_id) VALUES ($1, $2)", id, interestID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return false
	}

	return true
}

//remove interest from user
func RemoveInterest(w http.ResponseWriter, _interest Interest, id string) (bool) {
	interest := _interest.Name

	// Check if the interest is valid
	interestID := checkInterest(interest)
	if interestID == 0 {
		http.Error(w, "Interest not found", http.StatusBadRequest)
		return false
	}

	// Check if the user has the interest
	var userInterest UserInterest
	err := database.DB.Get(&userInterest, "SELECT * FROM user_interests WHERE user_id = $1 AND interest_id = $2", id, interestID)
	if err != nil {
		http.Error(w, "User does not have the interest", http.StatusBadRequest)
		return false
	}

	_, err = database.DB.Exec("DELETE FROM user_interests WHERE user_id = $1 AND interest_id = $2", id, interestID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return false
	}

	return true
}

//list user interests
func ListByUser(id string) ([]Interest, error) {
	var interests []Interest
	err := database.DB.Select(&interests, "SELECT i.id, i.name FROM interests i JOIN user_interests ui ON i.id = ui.interest_id WHERE ui.user_id = $1", id)
	if err != nil {
		return []Interest{}, err
	}

	return interests, nil	
}