const express = require('express');
const MoviesService = require('../services/movies')

const {
  movieIdSchema,
  createMovieSchema,
  updateMovieSchema
} = require('../utils/schemas/movies');

const validationHandler = require('../utils/middleware/validationHandler')

const cacheResponse = require('../utils/cacheResponse')
const {
  FIVE_MINUTES_IN_SECONDS,
  SIXTY_MINUTES_IN_SECONDS } = require('../utils/time')

function moviesApi(app) {
  const router = express.Router();
  app.use("/app/movies", router);

  const movieService = new MoviesService();

  router.get("/", async function (req, res, next) {
    cacheResponse(res, FIVE_MINUTES_IN_SECONDS);
    const { tags } = req.query;

    try {
      const movies = await movieService.getMovies({ tags })

      res.status(200).json({
        data: movies,
        message: 'movies listed'
      })
    } catch (err) {
      next(err);
    }
  });

  router.get("/:movieId", validationHandler({ movieId: movieIdSchema }, 'params'), async function (req, res, next) {
    const { movieId } = req.params;
    try {
      cacheResponse(res, SIXTY_MINUTES_IN_SECONDS);
      const movies = await movieService.getMovie({ movieId })

      res.status(200).json({
        data: movies,
        message: 'movie retrieved'
      })
    } catch (err) {
      next(err);
    }
  });

  router.post("/", validationHandler(createMovieSchema), async function (req, res, next) {
    const { body: movie } = req;
    try {
      const createdMovieId = await movieService.createMovie({ movie })

      res.status(201).json({
        data: createdMovieId,
        message: 'movie created'
      })
    } catch (err) {
      next(err);
    }
  });

  router.put("/:movieId", validationHandler({ movieId: movieIdSchema }, 'params'), validationHandler(updateMovieSchema), async function (req, res, next) {
    const { movieId } = req.params;
    const { body: movie } = req;
    try {
      const updatedMovieId = await movieService.updateMovie({ movieId, movie })

      res.status(200).json({
        data: updatedMovieId,
        message: 'movie updated'
      })
    } catch (err) {
      next(err);
    }
  });

  router.patch("/:movieId", validationHandler({ movieId: movieIdSchema }, 'params'), validationHandler(updateMovieSchema), async function (req, res, next) {
    const { movieId } = req.params;
    const { body: movie } = req;
    try {
      const updatedMovieId = await movieService.patchMovie({ movieId, movie })

      res.status(200).json({
        data: updatedMovieId,
        message: 'movie patched'
      })
    } catch (err) {
      next(err);
    }
  });

  router.delete("/:movieId", validationHandler({ movieId: movieIdSchema }, 'params'), async function (req, res, next) {
    const { movieId } = req.params;
    try {
      const deleteMovieId = await movieService.deleteMovie({ movieId })

      res.status(200).json({
        data: deleteMovieId,
        message: 'movie was delete'
      })
    } catch (err) {
      next(err);
    }
  });
}

module.exports = moviesApi;