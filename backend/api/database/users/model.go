package users

import "fmt"

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
}

func RetunValue(user User) string {
	var locationStr, bioStr, twoFAMethodStr, profilePictureIDStr, birthDateStr string

	// Check if Location is nil
	if user.Location != nil {
		locationStr = *user.Location
	} else {
		locationStr = "-"
	}

	// Check if TwoFAMethod is nil
	if user.TwoFAMethod != nil {
		twoFAMethodStr = *user.TwoFAMethod
	} else {
		twoFAMethodStr = "-"
	}

	// Check if Bio is nil
	if user.Bio != nil && *user.Bio != "" {
		bioStr = *user.Bio
	} else {
		bioStr = "-"
	}

	// Check if ProfilePictureID is nil
	if user.ProfilePictureID != nil {
		profilePictureIDStr = fmt.Sprintf("%d", *user.ProfilePictureID)
	} else {
		profilePictureIDStr = "-"
	}

	// Check if BirthDate is nil
	if user.BirthDate != nil {
		birthDateStr = *user.BirthDate
	} else {
		birthDateStr = "-"
	}

	return fmt.Sprintf(
		"ID: %d\nUsername: %s\nFirst Name: %s\nLast Name: %s\nEmail: %s\nIs Email Verify: %t\nPassword: %s\nLocation: %s\nFames: %d\nStatus: %s\nLast Time Online: %s\nTwoFA Method: %s\nGender: %s\nSexual Preference: %s\nBio: %s\nProfile Picture ID: %s\nBirth Date: %s\n\n",
		user.ID, user.Username, user.FirstName, user.LastName, user.Email, user.IsEmailVerify, user.Password, locationStr, user.Fames, user.Status, user.LastTimeOnline, twoFAMethodStr, user.Gender, user.SexualPreference, bioStr, profilePictureIDStr, birthDateStr)
}
