const router = require('express').Router();


// GET Route for retrieving all the movies
router.get('/movies', (req, res) => {
  console.info(`${req.method} request received for movies`);
  // TODO: read movies from sql server db table


});



// POST Route for a new movie
router.post('/add-movie', (req, res) => {
  console.info(`${req.method} request received to add a movie`);
  console.log(req.body);
  const { movie, review } = req.body;
  if (req.body) {
    const newMovie = {
      movie,
      review
    };
  }
    // TODO: add information for the body provided by client to sql server db


  res.end();
});


// POST Route for a new movie
router.post('/update-review', (req, res) => {
  console.info(`${req.method} request received to add a movie`);
  console.log(req.body);
  const { review } = req.body;
  if (req.body) {
    const newMovie = {
      review
    };
  }
    // TODO: add information from the body provided by client to sql server db (overwrite review field)


  res.end();
});

// DELETE Route for removing selected movie
router.delete("/movies/:id", (req, res) => {
  console.info(`${req.method} request received for movies`);
  const movieId = req.params.id;
// TOTO: read from sql server


  
// TODO: remove movie from the sql server table (filter out specified movie)


  res.end();
  });


module.exports = router;