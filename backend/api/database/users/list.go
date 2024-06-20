// database/users/list.go
package users

import (
	"fmt"
	"net/http"

	"api/database"


	// "goji.io/pat"
)


func List(w http.ResponseWriter, r *http.Request) {
    rows, err := database.DB.Query("SELECT * FROM users")
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var (
        id                 int
        account            string
        name               string
        email              string
        isEmailVerify      bool
        password           string
        location           *string
        fames              int
        status             string
        lastTimeOnline     string
        twoFAMethod        *string
        twoFACode          *string
    )

    for rows.Next() {
        err := rows.Scan(&id, &account, &name, &email, &isEmailVerify, &password, &location, &fames, &status, &lastTimeOnline, &twoFAMethod, &twoFACode)
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }

        var locationStr string
        if location != nil {
            locationStr = *location
        } else {
            locationStr = "-"
        }

        var twoFAMethodStr string
        if twoFAMethod != nil {
            twoFAMethodStr = *twoFAMethod
        } else {
            twoFAMethodStr = "-"
        }

        var twoFACodeStr string
        if twoFACode != nil {
            twoFACodeStr = *twoFACode
        } else {
            twoFACodeStr = "-"
        }

        fmt.Fprintf(w, "id: %d, account: %s, name: %s, email: %s, location: %s, two_fa_method: %s, two_fa_code: %s\n", id, account, name, email, locationStr, twoFAMethodStr, twoFACodeStr)
    }
	defer rows.Close()
}