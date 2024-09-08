package interests

type Interest struct {
	ID   int    `db:"id"`
	Name string `db:"name"`
}

type UserInterest struct {
	ID         int `db:"id"`
	UserID     int `db:"user_id"`
	InterestID int `db:"interest_id"`
}