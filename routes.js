'use strict';

const router = require('express').Router();

const cinema = new (require('./services/cinema'));
const autocomplete = new (require('./services/autocomplete'));
const account = new (require('./services/account'));

/* Requêtes des slides */
router.get('/slides', (req, res) => {

  res.json(cinema.getSlides());

});

/* Requêtes de tous les films */
router.get('/movies', (req, res) => {

  res.json(cinema.getMovies());

});

/* Requêtes d'un film spécifique */
router.get('/movies/:id', (req, res) => {

  let id = parseInt(req.params.id, 10) || 1;

  res.json(cinema.getMovie(id));

});

/* Requêtes de toutes les catégories de films */
router.get('/categories', (req, res) => {

  res.json(cinema.getCategories());

});

/* Requêtes de tous les cinémas */
router.get('/theaters', (req, res) => {

  res.json(cinema.getTheaters());

});

/* Requêtes d'un cinéma spécifique */
router.get('/theaters/:id', (req, res) => {

  let id = parseInt(req.params.id, 10) || 1;

  res.json(cinema.getTheater(id));

});

/* Requêtes de tous les cinémas */
router.post('/book', (req, res) => {

  res.json(cinema.book(req.body));

});

router.get('/autocomplete/:city', (req, res) => {

  res.json(autocomplete.getSuggestions(req.params.city));

});

/* Requête d'inscription */
router.post('/account/register', (req, res) => {

  res.json(account.register(req.body));

});

/* Requête de tentative de connexion */
router.post('/account/login', (req, res) => {

  res.json(account.login(req.body));

});

/* Requête de tentative de connexion */
router.get('/account/available/:email', (req, res) => {

  res.json(account.isAccountAvailable(req.params.email));

});

module.exports = router;
