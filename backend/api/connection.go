package main

import (
	_ "github.com/lib/pq"
)

// declare a global variable db
// sql.DB db

// var DB *sql.DB

// func InitDB() error {
// 	const (
// 		dbhost     = "postgre" // Need to use the docker-compose container name, instead of localhost, see https://github.com/quay/clair/issues/134#issuecomment-491300639
// 		dbport     = 5432
// 		dbuser     = "postgre"
// 		dbpassword = "123"
// 		dbname     = "postgre"
// 	)
// 	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+"password=%s dbname=%s sslmode=disable", dbhost, dbport, dbuser, dbpassword, dbname)
// 	db, err := sql.Open("postgre", psqlInfo)
// 	if err != nil {
// 		return err
// 	}

// 	err = db.Ping()
// 	if err != nil {
// 		return err
// 	}

// 	DB = db
// 	return nil
// }
