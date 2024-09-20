package data

import "time"

type Views struct {
	ID          int     	`json:"id"`
	Who			int			`json:"who"`
	Whom		int			`json:"whom"`
	Timestamp	time.Time	`json:"timestamps"`
}

type Likes struct {
	ID          int     	`json:"id"`
	Who			int			`json:"who"`
	Whom		int			`json:"whom"`
	Timestamp	time.Time	`json:"timestamps"`
}