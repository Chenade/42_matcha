CREATE TABLE user_media (
    id SERIAL PRIMARY KEY,
    uuid UUID,
    path VARCHAR(255),
    name VARCHAR(255)
);

CREATE TABLE user_interests (
    id SERIAL PRIMARY KEY,
    uuid UUID,
    interest_id UUID
);