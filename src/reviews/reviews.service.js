const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

// Helper Function
const addCritic = mapProperties({
  organization_name: ["critic", "organization_name"],
  preferred_name: ["critic", "preferred_name"],
  surname: ["critic", "surname"],
});

// Query Functions
const read = (review_id) => {
  return knex("reviews").select("*").where({ review_id }).first();
};

const readNewUpdate = (updatedReview) => {
  return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select("c.*", "r.*")
    .where({ review_id: updatedReview.review_id })
    .first()
    .then(addCritic);
};

const update = (updatedReview) => {
  return knex("reviews")
    .where({ review_id: updatedReview.review_id })
    .update(updatedReview);
};

const destroy = (review_id) => {
  return knex("reviews").where({ review_id }).del();
};

module.exports = {
  read,
  update,
  destroy,
  readNewUpdate,
};
