package users

import (
	"api/utils"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/golang-jwt/jwt/v5"
	"goji.io/pat"
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
	// usr_id, err := strconv.Atoi(r.Header.Get("usrId"))
	// Get user id from context claims

	usr_id := r.Context().Value(utils.ClaimsKey).(jwt.MapClaims)["user_id"]
	usr_id_str := strconv.Itoa(int(usr_id.(float64)))
	if usr_id == "" {
		http.Error(w, "Invalid usrId", http.StatusBadRequest)
		return
	}

	usr, err := GetById(usr_id_str)
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
