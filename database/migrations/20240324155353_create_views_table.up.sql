CREATE TABLE views (
    id      	SERIAL                      PRIMARY KEY,
    user_id		Integer NOT NULL,
	created_at 	TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
