CREATE TABLE sms (
    id SERIAL PRIMARY KEY,
    recipient TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
