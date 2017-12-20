'use strict';

// @ts-ignore
require('zone.js/dist/zone-node');

const express = require('express');
const compression = require('compression');
const fs = require('fs');
// @ts-ignore
const ngUniversal = require('@nguniversal/express-engine');
// @ts-ignore
const ngUniversalMap = require('@nguniversal/module-map-ngfactory-loader');

const config = require('./services/config');
const appRoutes = require('./routes');
const authCheck = require('./services/auth');
/** @type {any} */
const appServer = require('./main.bundle');

/**
 * @param {any} req
 * @param {any} res
 */
function angularRouter(req, res) {

  res.render('index', {
    req,
    res,
    providers: [{ provide: 'serverUrl', useValue: `${req.protocol}://${req.get('host')}` }]
  });

}

/* Initialisation d'Express, le principal framework web pour Node */
const app = express();

/* Traitement JSON des données reçues en POST */
app.use(express.json());

/* Compression gzip */
app.use(compression());

/* Vérifie le token JWT */
app.use(authCheck);

/* Home route before static files, or it will overwrite */
app.get('/', angularRouter);

/* Static files */
app.use(express.static(`${__dirname}/htdocs`));
app.use('/static', express.static(`${__dirname}/static`));

/* API routing */
app.use('/api', appRoutes);

app.engine('html', ngUniversal.ngExpressEngine({
  bootstrap: appServer.AppServerModuleNgFactory,
  providers: [
    ngUniversalMap.provideModuleMap(appServer.LAZY_MODULE_MAP)
  ]
}));

app.set('view engine', 'html');
app.set('views', `${__dirname}/htdocs`);

app.get('*', angularRouter);

/* Lancement du serveur web */
app.listen(3000, () => {
  console.log(`Backend running on http://localhost:3000`);
});
