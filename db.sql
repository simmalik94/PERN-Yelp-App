CREATE TABLE restaurants (
    id SERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    location VARCHAR(50) NOT NULL,
    price_range INT NOT NULL check(price_range>= 1 AND price_range<=5 )
);


CREATE TABLE reviews ( 
    id SERIAL NOT NULL PRIMARY KEY,
    restaurant_id  INT NOT NULL REFERENCES restaurants(id),
    name VARCHAR(50) NOT NULL,
    review TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating>=1 and rating <=5)
);
