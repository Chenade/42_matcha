/*
- matches
    - user_1
    - user_2
    - timestamps
    */

CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    user_1 UUID,
    user_2 UUID,
    timestamp TIMESTAMP
);