const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// Validation Middleware
const hasMovieId = (req, res, next) => {
  const { movieId } = req.params;
  if (movieId) {
    next();
  } else {
    next({ status: 400, message: `Must specify movie id` });
  }
};

const movieIdExists = async (req, res, next) => {
  const movieId = Number(req.params.movieId);
  const movie = await service.read(movieId);
  if (movie) {
    res.locals.movie = movie;
    next();
  } else {
    next({ status: 404, message: `Movie cannot be found` });
  }
};

// Route Functions
const list = async (req, res, next) => {
  const data = await service.list();
  res.status(200).json({ data });
};

const read = (req, res, next) => {
  const { movie } = res.locals;
  res.status(200).json({ data: movie });
};

const listMoviesShowing = async (req, res, next) => {
  const { is_showing } = req.query;

  if (is_showing) {
    const data = await service.listMoviesShowing();
    res.status(200).json({ data });
  } else {
    next();
  }
};

const listTheatersForMovie = async (req, res, next) => {
  const { movieId } = req.params;
  const data = await service.listTheatersForMovie(movieId);
  res.status(200).json({ data });
};

const listReviewsForMovie = async (req, res, next) => {
  const { movieId } = req.params;
  const data = await service.listReviewsForMovie(movieId);
  res.status(200).json({ data });
};

module.exports = {
  list: [asyncErrorBoundary(listMoviesShowing), asyncErrorBoundary(list)],
  read: [hasMovieId, asyncErrorBoundary(movieIdExists), read],
  listReviewsForMovie: [asyncErrorBoundary(listReviewsForMovie)],
  listTheatersForMovie: [asyncErrorBoundary(listTheatersForMovie)],
};
