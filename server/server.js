require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db/index");
const morgan = require("morgan");
const app = express();

//middleware

//app.use(morgan("dev"));
// app.use((req, res, next) => {
//   res.status(404).json({
//     status: "fail",
//   });
//   next();
// });
app.use(cors());

//this middleware attaches data to 'req.body'
app.use(express.json());

//get all restaurants
app.get("/api/v1/restaurants", async (req, res) => {
  try {
    //const results = await db.query("SELECT * FROM restaurants");
    const restaurantRatingData = await db.query(
      "select *from restaurants left join (select restaurant_id,COUNT(*),TRUNC(AVG(rating),1)as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id;"
    );
    console.log(restaurantRatingData);

    res.status(200).json({
      status: "success",
      results: restaurantRatingData.rows.length,
      data: {
        restaurant: restaurantRatingData.rows,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// get a single restaurant
app.get("/api/v1/restaurants/:id", async (req, res) => {
  try {
    const restaurant = await db.query(
      "select *from restaurants left join (select restaurant_id,COUNT(*),TRUNC(AVG(rating),1)as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id where id =$1;",
      [req.params.id]
    );

    const reviews = await db.query(
      "SELECT * FROM reviews WHERE restaurant_id =$1",
      [req.params.id]
    );

    res.status(200).json({
      status: "success",
      data: {
        restaurant: restaurant.rows[0],
        reviews: reviews.rows,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// create a restaurant
app.post("/api/v1/restaurants", async (req, res) => {
  //console.log(req.body);
  try {
    const results = await db.query(
      "INSERT INTO restaurants (name,location,price_range) VALUES ($1,$2,$3) returning *",
      [req.body.name, req.body.location, req.body.price_range]
    );
    console.log(results);
    res.status(201).json({
      status: "success",
      data: {
        restaurant: results.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// Update restaurants
app.put("/api/v1/restaurants/:id", async (req, res) => {
  try {
    const results = await db.query(
      "UPDATE restaurants SET name = $1, location = $2, price_range =$3 WHERE id =$4 returning *",
      [req.body.name, req.body.location, req.body.price_range, req.params.id]
    );
    console.log(results);
    //console.log(req.body);
    res.status(200).json({
      status: "success",
      data: {
        restaurant: results.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

//delete restaurant
app.delete("/api/v1/restaurants/:id", async (req, res) => {
  try {
    const results = await db.query("DELETE FROM restaurants WHERE id =$1", [
      req.params.id,
    ]);
    res.status(204).json({
      status: "success",
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/api/v1/restaurants/:id/addReview", async (req, res) => {
  try {
    const newReview = await db.query(
      "INSERT INTO reviews (restaurant_id,name,review,rating) VALUES ($1,$2,$3,$4) returning *;",
      [req.params.id, req.body.name, req.body.review, req.body.rating]
    );
    res.status(201).json({
      status: "success",
      data: {
        review: newReview.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

const port = 4000;
app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
