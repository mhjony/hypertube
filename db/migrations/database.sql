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
	movies_watched VARCHAR(255)[] DEFAULT '{}',
	language VARCHAR(255),
	verified SMALLINT NOT NULL DEFAULT 0,
	avatar varchar(255) DEFAULT NULL
);

-- Create the movies table
CREATE TABLE movies (
	id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	imdb_code VARCHAR(50) NOT NULL UNIQUE,
	title VARCHAR(255) NOT NULL,
	last_watched timestamp DEFAULT NULL,
	size INT DEFAULT 0,
	server_location VARCHAR(255) DEFAULT NULL,
	downloaded SMALLINT NOT NULL DEFAULT 0,
	subtitle_paths VARCHAR(255)[] DEFAULT '{}',
	magnet VARCHAR(255) NOT NULL
);

-- Create the comments table
CREATE TABLE comments (
	id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	user_id uuid NOT NULL,
	imdb_code VARCHAR(50) NOT NULL,
	CONSTRAINT fk_user_id FOREIGN KEY(user_id) REFERENCES users(user_id),
	CONSTRAINT fk_imdb_code FOREIGN KEY(imdb_code) REFERENCES movies(imdb_code),
	comment_body VARCHAR(255) NOT NULL,
	created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insert predifined users for admin to use
INSERT INTO users (first_name, last_name, user_name, email, verified, password)
VALUES 
('admin', 'user', 'admin', 'admin@gmail.com', '1', '$2a$10$PAM0GqbRGkOS2bVupYY0he23LiSv2THGyfvtULZpcdRTzSM7BQ01u'),
('demo', 'user', 'demo', 'demo@gmail.com', '1', '$2a$10$PAM0GqbRGkOS2bVupYY0he23LiSv2THGyfvtULZpcdRTzSM7BQ01u');

