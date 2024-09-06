// connection.go
package database

import (
	// "database/sql"
	"fmt"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

// declare a global variable db
// sql.DB db

var DB *sqlx.DB

func InitDB() error {
	const (
		dbhost     = "localhost" // Need to use the docker-compose container name, instead of localhost, see https://github.com/quay/clair/issues/134#issuecomment-491300639
		dbport     = 5432
		dbuser     = "postgres"
		dbpassword = "123"
		dbname     = "postgres"
	)
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+"password=%s dbname=%s sslmode=disable", dbhost, dbport, dbuser, dbpassword, dbname)
	db, err := sqlx.Connect("postgres", psqlInfo)
	if err != nil {
		return err
	}

	err = db.Ping()
	if err != nil {
		return err
	}

	DB = db
	return nil
}
