package data

import (
	"strconv"
	"api/database"
	Interest "api/srcs/interests"
	User "api/srcs/users"
)

func GetConnectionsByUser(id string) ([]User.OtherUser, error) {
	var userInteractions []User.OtherUser
	query := `
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
			users.profile_picture_id,
			COALESCE(likes.who IS NOT NULL, false) AS liked,
			COALESCE(views.who IS NOT NULL, false) AS viewed
		FROM users
        LEFT JOIN likes ON likes.who = users.id AND likes.whom = $1
        LEFT JOIN views ON views.who = users.id AND views.whom = $1
        WHERE likes.whom = $1 OR views.whom = $1
		ORDER BY views.timestamp DESC
	`
	err := database.DB.Select(&userInteractions, query, id)
	if err != nil {
		return []User.OtherUser{}, err
	}

	for i := range userInteractions {
		userInteractions[i].Interests, err = Interest.ListByUser(strconv.Itoa(userInteractions[i].UserID))
		if err != nil {
			return []User.OtherUser{}, err
		}
	}

	return userInteractions, nil
}

func AddView(view Views) error {
	_, err := database.DB.NamedExec("INSERT INTO views (who, whom) VALUES (:who, :whom)", view)
	if err != nil {
		return err
	}

	return nil
}

func AddLike(like Likes) error {
	_, err := database.DB.NamedExec("INSERT INTO likes (who, whom) VALUES (:who, :whom)", like)
	if err != nil {
		return err
	}

	return nil
}

func RemoveLike(like Likes) error {
	_, err := database.DB.NamedExec("DELETE FROM likes WHERE who = :who AND whom = :whom", like)
	if err != nil {
		return err
	}

	return nil
}