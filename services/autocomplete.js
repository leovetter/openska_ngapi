'use strict';

class Autocomplete {

  constructor() {

    let dbPath = '../data/world-cities.json';

    /**
     * Récupération des données sur le serveur (pourrait être en base de données)
     * @type {string[]}
     */
    this.data = require(dbPath);

  }

  /**
   * @param {string} input
   */
  getSuggestions(input) {

    /** @type {string[]} */
    let suggestions = [];

    /* Performances : recherche à partir de 2 caractères seulement */
    if (input.length > 2) {

      suggestions = this.data
      .filter(value => value.toLowerCase().startsWith(input.toLowerCase()))
      .slice(0, 5);

    }

    return suggestions;

  }

}

module.exports = Autocomplete;
