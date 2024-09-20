package users

import (
	Interests "api/srcs/interests"
)

type User struct {
	ID               int     `db:"id"`
	Username         string  `db:"username"`
	FirstName        string  `db:"first_name"`
	LastName         string  `db:"last_name"`
	Email            string  `db:"email"`
	IsEmailVerify    bool    `db:"isemailverify"`
	Password         string  `db:"password"`
	Location         *string `db:"location"`
	Fames            int     `db:"fames"`
	Status           string  `db:"status"`
	LastTimeOnline   string  `db:"last_time_online"`
	TwoFAMethod      *string `db:"two_fa_method"`
	TwoFACode        *string `db:"two_fa_code"`
	Gender           string  `db:"gender"`
	SexualPreference string  `db:"sexual_perference"`
	Bio              *string  `db:"bio"`
	ProfilePictureID *int     `db:"profile_picture_id"`
	BirthDate        *string  `db:"birth_date"`
	Pictures         []UserPicture
	Interests        []Interests.Interest
}

type UserPicture struct {
	ID       int    `db:"id"`
	UserID   int    `db:"user_id"`
	Path  	string	`db:"path"`
}