package images

type UserPicture struct {
	ID       int    `db:"id"`
	// UserID   int    `db:"user_id"`
	Path  	string	`db:"path"`
}
