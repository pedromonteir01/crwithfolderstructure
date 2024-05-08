CREATE DATABASE clashroyaledb;

\c clashroyaledb;

CREATE TABLE cards(
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(75) NOT NULL,
    level INT NOT NULL,
    rarity VARCHAR(9) NOT NULL,
    type VARCHAR(15) NOT NULL,
    life INT NOT NULL,
    damage INT NOT NULL
);

CREATE TABLE battles(
    id SERIAL PRIMARY KEY NOT NULL,
    winnerid INT,
    loserid INT,
    FOREIGN KEY (winnerid) REFERENCES cards(id),
    FOREIGN KEY (loserid) REFERENCES cards(id)
);

ALTER TABLE battles
ADD COLUMN cardOneId INT REFERENCES cards (id),
ADD COLUMN cardTwoId INT REFERENCES cards (id),
ADD COLUMN nameCardOne VARCHAR(255),
ADD COLUMN nameCardTwo VARCHAR(255);