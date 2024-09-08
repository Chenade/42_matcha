package interests

import (
	"net/http"
	"encoding/json"

	"goji.io/pat"
)

func ListInterests(w http.ResponseWriter, r *http.Request) {
	List(w, r)
}

func ListInterestsByUser(w http.ResponseWriter, r *http.Request) {
	id := pat.Param(r, "usrId")
	ListUserInterests(w, r, id)
}

func AddToUser(w http.ResponseWriter, r *http.Request) {
	usrId := pat.Param(r, "usrId")
	if usrId == "" {
		http.Error(w, "id is required", http.StatusBadRequest)
		return
	}

	var _interest Interest
	err := json.NewDecoder(r.Body).Decode(&_interest)
	if err != nil {
		http.Error(w, "Invalid JSON body", http.StatusBadRequest)
		return
	}

	if !AddInterest(w, _interest, usrId) {
		return
	}
	json.NewEncoder(w).Encode("Interest added successfully")
}

func RemoveFromUser(w http.ResponseWriter, r *http.Request) {
	usrId := pat.Param(r, "usrId")
	if usrId == "" {
		http.Error(w, "id is required", http.StatusBadRequest)
		return
	}

	var _interest Interest
	err := json.NewDecoder(r.Body).Decode(&_interest)
	if err != nil {
		http.Error(w, "Invalid JSON body", http.StatusBadRequest)
		return
	}

	if !RemoveInterest(w, _interest, usrId) {
		return
	}
	json.NewEncoder(w).Encode("Interest removed successfully")
}