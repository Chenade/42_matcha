CREATE TABLE views (
    id SERIAL PRIMARY KEY,
    who UUID,
    whom UUID,
    timestamp TIMESTAMP
);