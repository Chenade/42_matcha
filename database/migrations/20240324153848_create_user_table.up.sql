CREATE TABLE users (
    id                  SERIAL          PRIMARY KEY,
    username            VARCHAR(255)    UNIQUE   NOT NULL,
    first_name          VARCHAR(255)    NOT NULL,
    last_name           VARCHAR(255)    NOT NULL,
    email               VARCHAR(255)    UNIQUE   NOT NULL,
    isEmailVerify       BOOLEAN         DEFAULT FALSE,
    password            VARCHAR(255)    NOT NULL,
    location            VARCHAR(255),
    fames               INTEGER         DEFAULT 0,
    status              VARCHAR(255)    DEFAULT 'offline',
    last_time_online    TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    two_fa_method       VARCHAR(255),
    two_fa_code         VARCHAR(255)
);
