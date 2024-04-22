CREATE TABLE chat (
    id SERIAL PRIMARY KEY,
    sender UUID,
    receiver UUID,
    content TEXT,
    timestamp TIMESTAMP
);