/*
- matches
    - user_1
    - user_2
    - timestamps
    */

CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    user_1 integer REFERENCES users(id),
    user_2 integer REFERENCES users(id),
	created_at 	TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);