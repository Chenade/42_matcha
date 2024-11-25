package data

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"goji.io/pat"

	WS "api/srcs/websocket"
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
	
	if !WS.WsNotificationSend(
		id,
		"info", "Someone viewed your profile") {
		log.Println("Error sending notification")
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

	if num_id == usr_id {
		http.Error(w, "You can't like yourself", http.StatusBadRequest)
		return
	}

	// Check if the user has already liked the other user
	likes, err := GetLikes(Likes{ Who: usr_id, Whom: num_id,})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if len(likes) > 0 {
		http.Error(w, "You have already liked this user", http.StatusBadRequest)
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

	// Check if the other user has liked the user
	likes, err = GetLikes(Likes{ Who: num_id, Whom: usr_id,})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if len(likes) > 0 {
		err = AddMatch(Matches{
			User_1: usr_id,
			User_2: num_id,
		})
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode("Matched")

		if !WS.WsNotificationSend(
			usrId,
			"success", "You have a new match") {
			log.Println("Error sending notification")
		}
		return
	}

	if !WS.WsNotificationSend(
		usrId,
		"info", "Someone liked you") {
		log.Println("Error sending notification")
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

	// Check if the other user has liked the user
	likes, err := GetMatches(Matches{ User_1: usr_id, User_2: num_id,})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if len(likes) > 0 {
		err = RemoveMatch(Matches{
			User_1: usr_id,
			User_2: num_id,
		})
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		if !WS.WsNotificationSend(
			usrId,
			"info", "A match has been removed") {
			log.Println("Error sending notification")
		}	
	}
	
	json.NewEncoder(w).Encode("Like removed")
}