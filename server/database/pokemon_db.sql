CREATE SCHEMA IF NOT EXISTS pokemon_data;

USE pokemon_data;

CREATE TABLE IF NOT EXISTS pokemon (
    pokemon_id INT NOT NULL,
    pokemon_name VARCHAR(20),
    hp INT NOT NULL,
    PRIMARY KEY (pokemon_id)
);

CREATE TABLE IF NOT EXISTS move (
    move_id INT NOT NULL,
    move_name VARCHAR(20),
    power INT NOT NULL,
    accuracy FLOAT NOT NULL,
    PRIMARY KEY (move_id)
);

CREATE TABLE IF NOT EXISTS has (
    pokemon_id INT NOT NULL,
    move_id INT NOT NULL,
    PRIMARY KEY (pokemon_id, move_id),
    FOREIGN KEY (pokemon_id) REFERENCES pokemon (pokemon_id) ON DELETE CASCADE,
    FOREIGN KEY (move_id) REFERENCES move (move_id) ON DELETE CASCADE
);
