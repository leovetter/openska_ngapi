'use strict';

class Cinema {

  constructor() {

    /* Récupération des données sur le serveur (pourrait être en base de données) */

    let dbPathMovies     = '../data/movies.json';
    let dbPathCategories = '../data/categories.json';
    let dbPathSessions   = '../data/sessions.json';
    let dbPathTheaters   = '../data/theaters.json';
    let dbPathSlides     = '../data/slides.json';

    /** @type {Movie[]} */
    this.movies = require(dbPathMovies);
    /** @type {Category[]} */
    this.categories = require(dbPathCategories);
    /** @type {Session[]} */
    this.sessions = require(dbPathSessions);
    /** @type {Theater[]} */
    this.theaters = require(dbPathTheaters);
    /** @type {Slide[]} */
    this.slides = require(dbPathSlides);

  }

  getMovies() {

    return this.movies;

  }

  /** @param {number} id */
  getMovie(id) {

    let movie = Object.assign({}, this.movies[id - 1]);

    /* S'il y a des séances prévues, remplace les ids des sessions pour les données réelles */
    if (('sessionsIds' in movie) && (movie.sessionsIds != null)) {

      movie.sessions = movie.sessionsIds
        .map((id) => Object.assign({}, this.sessions[id - 1]))
        .map((session) => this.fillSessionTheater(session));

    }

    return movie;

  }

  getCategories() {

    return this.categories;

  }

  getTheaters() {

    return this.theaters;

  }

  /** @param {number} id */
  getTheater(id) {

    let theater = Object.assign({}, this.theaters[id - 1]);

    /* S'il y a des séances prévues, remplace les ids des sessions pour les données réelles */
    if (('sessionsIds' in theater) && (theater.sessionsIds != null)) {

      theater.sessions = theater.sessionsIds
        .map((id) => Object.assign({}, this.sessions[id - 1]))
        .map((session) => this.fillSessionMovie(session));

    }

    return theater;

  }

  /**
   * @param {{ session: number; schedule: number; }} body
   * @returns {Reservation | null}
   */
  book(body) {

    const { session, schedule } = body;

    if ((typeof session !== 'number') || (typeof schedule !== 'number') || !this.sessions[session - 1]) {
      return null;
    }

    /** @type {{ movie?: Movie, theater?: Theater, schedules: Schedule[] }} */
    let sessionData = this.fillSessionTheater(this.fillSessionMovie(Object.assign({}, this.sessions[session - 1])));

    if (!sessionData.movie || !sessionData.theater || !sessionData.schedules[schedule - 1]) {
      return null;
    }

    /** @type {Reservation} */
    let reservation = {
      id: session,
      movieTitle: sessionData.movie.title,
      theaterTitle: sessionData.theater.title,
      scheduleId: schedule,
      scheduleHour: sessionData.schedules[schedule - 1].hour

    };

    return reservation;

  }

  /** @param {Session} session */
  fillSessionMovie(session) {

    session.movie = this.movies[session.movieId - 1];

    return session;

  }

  /** @param {Session} session */
  fillSessionTheater(session) {

    session.theater = this.theaters[session.theaterId - 1];

    return session;

  }

  getSlides() {

    return this.slides;

  }

}

module.exports = Cinema;
