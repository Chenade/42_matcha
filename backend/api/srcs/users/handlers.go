package users

import (
	"encoding/json"
	"net/http"
	"goji.io/pat"
	"strconv"
)
// get by id
func GetInfo(w http.ResponseWriter, r *http.Request) {
	who, err := strconv.Atoi(r.Header.Get("usrId"))
	if err != nil {
		who = 0
		return
	}	

	whom := pat.Param(r, "usrId")

	if whom == "" {
		http.Error(w, "usrId is required", http.StatusBadRequest)
		return
	}

	usr, err := GetOthersById(strconv.Itoa(who), whom)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(usr)
}

/** Start of auth required routes **/

// get own profile
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
