package data

import (
	"strconv"
	"api/database"
	Interest "api/srcs/interests"
	User "api/srcs/users"
	Images "api/srcs/images"
)

func contains(slice []int, item int) bool {
	for _, v := range slice {
		if v == item {
			return true
		}
	}
	return false
}

func GetConnectionsByUser(id string) ([]User.OtherUser, error) {
	var userInteractions []User.OtherUser
	query := `
		SELECT DISTINCT ON (users.id)
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
		ORDER BY users.id, views.timestamp DESC;

	`
	err := database.DB.Select(&userInteractions, query, id)
	if err != nil {
		return []User.OtherUser{}, err
	}
	

	query = `SELECT user_1, user_2 FROM matches WHERE user_1 = $1 OR user_2 = $1`
	res, err := database.DB.Queryx(query, id)
	if err != nil {
		return []User.OtherUser{}, err
	}

	matched := []int{}
	for res.Next() {
		var user1, user2 int
		if err := res.Scan(&user1, &user2); err != nil {
			return []User.OtherUser{}, err
		}
		if strconv.Itoa(user1) == id {
			matched = append(matched, user2)
		} else {
			matched = append(matched, user1)
		}
	}
	

	for i := range userInteractions {
		userInteractions[i].Interests, err = Interest.ListByUser(strconv.Itoa(userInteractions[i].UserID))
		if err != nil {
			return []User.OtherUser{}, err
		}
		if userInteractions[i].ProfilePictureID != nil {
			userInteractions[i].ProfilePic, err = Images.GetById(strconv.Itoa(*userInteractions[i].ProfilePictureID))
			if err != nil {
				return []User.OtherUser{}, err
			}
		}
		if exists := contains(matched, userInteractions[i].UserID); exists {
			userInteractions[i].Matched = true
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

func GetLikes(like Likes) ([]Likes, error) {
	var likes []Likes
	err := database.DB.Select(&likes, "SELECT * FROM likes WHERE who = $1 AND whom = $2", like.Who, like.Whom)
	if err != nil {
		return []Likes{}, err
	}

	return likes, nil
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

func GetMatches(match Matches) ([]Matches, error) {
	var matches []Matches
	err := database.DB.Select(&matches, "SELECT * FROM matches WHERE user_1 = $1 AND user_2 = $2", match.User_1, match.User_2)
	if err != nil {
		return []Matches{}, err
	}

	return matches, nil
}

func AddMatch(match Matches) error {
	_, err := database.DB.NamedExec("INSERT INTO matches (user_1, user_2) VALUES (:user_1, :user_2)", match)
	if err != nil {
		return err
	}

	return nil
}

func RemoveMatch(match Matches) error {
	_, err := database.DB.NamedExec("DELETE FROM matches WHERE user_1 = :user_1 AND user_2 = :user_2", match)
	if err != nil {
		return err
	}

	return nil
}