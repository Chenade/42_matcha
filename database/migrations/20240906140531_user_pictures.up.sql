CREATE TABLE user_pictures (
    id                  SERIAL          PRIMARY KEY,
    user_id             INTEGER         REFERENCES users(id) ON DELETE CASCADE,
    path                VARCHAR(255)    NOT NULL
);
