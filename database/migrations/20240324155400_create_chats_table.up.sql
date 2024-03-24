CREATE TABLE messages (
    id      	SERIAL                      PRIMARY KEY,
    sender_id		Integer NOT NULL,
    reciever_id		Integer NOT NULL,
	created_at 	TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
