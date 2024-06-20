// connection.go
package database

import (
    "database/sql"
	"fmt"
	_ "github.com/lib/pq"
)

// declare a global variable db
// sql.DB db

var Db *sql.DB
func InitDB() (error) {
	const (
		dbhost     = "localhost"
		dbport     = 5432
		dbuser     = "postgres"
		dbpassword = "123"
		dbname   = "postgres"
	)
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+"password=%s dbname=%s sslmode=disable", dbhost, dbport, dbuser, dbpassword, dbname)
	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		return  err
	}
	
	err = db.Ping()
	if err != nil {
		return  err 
	}

	Db = db
}
