CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    uuid UUID,
    target UUID,
    timestamp TIMESTAMP,
    reason VARCHAR(255)
);