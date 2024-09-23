package data

import (
	"api/database"
)

// 
func GetViewsByUser(id string) ([]Views, error) {
    var views []Views
	// select from views and join with user info
	err := database.DB.Select(&views, "SELECT views.*, users.username FROM views JOIN users ON views.who = users.id WHERE whom = $1", id)
    if err != nil {
        return []Views{}, err
    }

	return views, nil
}

func GetLikesByUser(id string) ([]Likes, error) {
	var likes []Likes
	err := database.DB.Select(&likes, "SELECT likes.*, users.username FROM Flikes JOIN users ON likes.who = users.id WHERE whom = $1", id)
	if err != nil {
		return []Likes{}, err
	}

	return likes, nil
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