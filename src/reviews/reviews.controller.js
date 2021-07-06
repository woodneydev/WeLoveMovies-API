const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//Validation Middleware
const hasReviewId = (req, res, next) => {
  const { reviewId } = req.params;
  if (reviewId) {
    next();
  } else {
    next({ status: 400, message: `Must specify review id` });
  }
};

const doesReviewExist = async (req, res, next) => {
  const { reviewId } = req.params;
  const review = await service.read(reviewId);
  if (review) {
    res.locals.review = review;
    next();
  } else {
    next({ status: 404, message: `Review cannot be found.` });
  }
};

const hasValidProperties = (req, res, next) => {
  const VALID_PROPERTIES = [
    "review_id",
    "content",
    "score",
    "critic_id",
    "movie_id",
  ];

  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
};

// Route Functions
const update = async (req, res, next) => {
  const updatedReview = {
    ...req.body.data,
    review_id: res.locals.review.review_id,
  };

  await service.update(updatedReview);
  const data = await service.readNewUpdate(updatedReview);
  res.status(201).json({ data });
};

const destroy = async (req, res, next) => {
  const { reviewId } = req.params;
  await service.destroy(reviewId);
  res.sendStatus(204);
};

module.exports = {
  update: [
    hasReviewId,
    doesReviewExist,
    hasValidProperties,
    asyncErrorBoundary(update),
  ],
  delete: [asyncErrorBoundary(doesReviewExist), asyncErrorBoundary(destroy)],
};
