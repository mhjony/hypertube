-- CREATE DATABASE hypertube;
-- CREATE DATABASE hypertube;

-- Install the uuid-ossp extension

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the users table
CREATE TABLE users (
	user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	first_name VARCHAR(50) NOT NULL,
	last_name VARCHAR(50) NOT NULL,
	user_name VARCHAR(50) NOT NULL UNIQUE,
	email VARCHAR(255) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL,
	token varchar(255) DEFAULT NULL,
	verified SMALLINT NOT NULL DEFAULT 0,
);

-- Insert predifined users for admin to use
INSERT INTO users (first_name, last_name, user_name, email, verified, password)
VALUES 
('admin', 'user', 'admin', 'admin@gmail.com', '1', '$2a$10$PAM0GqbRGkOS2bVupYY0he23LiSv2THGyfvtULZpcdRTzSM7BQ01u'),
('demo', 'user', 'demo', 'demo@gmail.com', '1', '$2a$10$PAM0GqbRGkOS2bVupYY0he23LiSv2THGyfvtULZpcdRTzSM7BQ01u')

