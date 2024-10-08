CREATE TABLE likes (
    id      	SERIAL                      PRIMARY KEY,
    who integer REFERENCES users(id),
    whom integer REFERENCES users(id),
	created_at 	TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
