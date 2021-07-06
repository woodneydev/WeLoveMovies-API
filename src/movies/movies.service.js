const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

//Helper Function
const addCritic = mapProperties({
  critic_id: ["critic", "critic_id"],
  preferred_name: ["critic", "preferred_name"],
  organization_name: ["critic", "organization_name"],
  surname: ["critic", "surname"],
});

// Query Functions
const read = (movie_id) => {
  return knex("movies").select("*").where({ movie_id }).first();
};

const list = () => {
  return knex("movies").select("*");
};

const listMoviesShowing = () => {
  return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .distinct("m.*")
    .where({ "mt.is_showing": 1 });
};

const listTheatersForMovie = (movie_id) => {
  return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .join("theaters as t", "t.theater_id", "mt.theater_id")
    .select("t.*", "mt.movie_id", "mt.is_showing")
    .where({ "m.movie_id": movie_id })
    .andWhere({ "mt.is_showing": 1 });
};

const listReviewsForMovie = (movie_id) => {
  return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .join("movies as m", "r.movie_id", "m.movie_id")
    .select("r.*", "c.*")
    .where({ "r.movie_id": movie_id })
    .then((reviews) => {
      return reviews.map((review) => addCritic(review));
    });
};

module.exports = {
  read,
  list,
  listMoviesShowing,
  listTheatersForMovie,
  listReviewsForMovie,
};
