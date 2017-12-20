'use strict';

const express = require('express');
const compression = require('compression');

const appRoutes = require('./routes');
const authCheck = require('./services/auth');

/* Initialisation d'Express, le principal framework web pour Node */
const app = express();

/* Traitement JSON des données reçues en POST */
app.use(express.json());

/* Compression gzip */
app.use(compression());

/* Vérifie le token JWT */
app.use(authCheck);

/* Static files */
app.use(express.static(`${__dirname}/htdocs`));
app.use('/static', express.static(`${__dirname}/static`));

/* API routing */
app.use('/api', appRoutes);

/* For all others routes, serve index.html, where Angular will take care of app routing */
app.get('*', (req, res) => {
  res.sendFile(`${__dirname}/htdocs/index.html`);
});

/* Lancement du serveur web */
app.listen(3000, () => {
  console.log(`Backend running on http://localhost:3000`);
});
