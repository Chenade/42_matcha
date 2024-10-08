CREATE TABLE views (
    id SERIAL PRIMARY KEY,
    who integer REFERENCES users(id),
    whom integer REFERENCES users(id),
    timestamp TIMESTAMP DEFAULT NOW()
);