package data

import (
	"fmt"
	"encoding/json"
	"net/http"
	"strconv"
	"goji.io/pat"

)

func ListConnectionsByUser(w http.ResponseWriter, r *http.Request) {
	id := r.Header.Get("usrId")

	if id == "" {
		http.Error(w, "usrId is required", http.StatusBadRequest)
		return
	}

	connections, err := GetConnectionsByUser(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(connections)
}

func AddViewRecord(w http.ResponseWriter, r *http.Request, id string) error{
	num_id, usr_id := 0, 0
	
	num_id, err := strconv.Atoi(id)
	if err != nil {
		return fmt.Errorf("invalid id")
	}
	
	usr_id, err = strconv.Atoi(r.Header.Get("usrId"))
	if err != nil {
	return fmt.Errorf("invalid usrId")
	}	
	
	if num_id != usr_id {
		err = AddView(Views{
			Who: usr_id,
			Whom: num_id,
		})
		if err != nil {
			return err
		}
	}
	
	return nil
}

func AddLikeRecord(w http.ResponseWriter, r *http.Request) {
	num_id, usr_id := 0, 0

	usrId := pat.Param(r, "usrId")

	num_id, err := strconv.Atoi(usrId)
	if err != nil {
		http.Error(w, "Invalid usrId", http.StatusBadRequest)
		return
	}

	usr_id, err = strconv.Atoi(r.Header.Get("usrId"))
	if err != nil {
		http.Error(w, "Invalid usrId", http.StatusBadRequest)
		return
	}	

	err = AddLike(Likes{
		Who: usr_id,
		Whom: num_id,
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode("Like added")
}

func RemoveLikeRecord(w http.ResponseWriter, r *http.Request) {
	num_id, usr_id := 0, 0

	usrId := pat.Param(r, "usrId")

	num_id, err := strconv.Atoi(usrId)
	if err != nil {
		http.Error(w, "Invalid usrId", http.StatusBadRequest)
		return
	}

	usr_id, err = strconv.Atoi(r.Header.Get("usrId"))
	if err != nil {
		http.Error(w, "Invalid usrId", http.StatusBadRequest)
		return
	}	

	err = RemoveLike(Likes{
		Who: usr_id,
		Whom: num_id,
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode("Like added")
}