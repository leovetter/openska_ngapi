'use strict';

const fs = require('fs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const config = require('./config');

const dbPath = '../data/users.json';

class Account {

  get users() {

    if (!this._users) {
      /** @type {User[]} */
      let users = require(dbPath);
      this._users = users;
    }

    return this._users;

  }

  /** @param {User} userData */
  saveUser(userData) {

    this.users.push(userData);

    fs.writeFile(`${__dirname}/${dbPath}`, JSON.stringify(this.users), (error) => {
      if (error) {
        console.log(error);
      }
    });

  }

  /** @param {string} email */
  isUserExisting(email) {

    for (let user of this.users) {
      if (user.email === email) {
        return user;
      }
    }

    return false;

  }

  /**
   * @param {string} email
   * @param {string} password
   * @returns {UserInput}
   */
  filterInputs(email, password) {

    return {
      email: validator.escape(email || ''),
      password: validator.escape(password || '')
    };

  }

  /** @param {UserInput} inputs */
  validateInputs(inputs) {

    /* Vérification des données (champs obligatoires, formats...) */
    let errors = [];

    if (validator.isEmpty(inputs.email)) {
      errors.push(`L'adresse e-mail est obligatoire.`);
    } else if (!validator.isEmail(inputs.email)) {
      errors.push(`L'adresse e-mail est invalide.`);
    }

    if (validator.isEmpty(inputs.password)) {
      errors.push(`Le mot de passe est obligatoire.`);
    }

    return errors;

  }

  /**
   * @param {UserInput} inputs
   * @returns {User}
   */
  normalizeInputs(inputs) {

    return {
      email: validator.normalizeEmail(inputs.email) || '',
      hash: inputs.password
    };

  }

  /**
   * @param {{ email: string; password: string | { password1: string; password2: string; }; }} body
   * @returns {AccountResponse}
   */
  register(body) {

    let { email, password } = body;
    email = (typeof email === 'string') ? email : '';
    password = ((typeof password === 'string') || (typeof password === 'object')) ? password : '';

    if (typeof password === 'object') {

      let { password1, password2 } = password;
      password1 = (typeof password1 === 'string') ? password1 : '';
      password2 = (typeof password2 === 'string') ? password2 : '';

      if (password1 !== password2) {
        return {
          success: false,
          errors: [`Les deux mots de passe ne sont pas identiques.`]
        };
      }

      password = password1;

    }

    /* Filtrage des données utilisateur avec le module validator */
    let inputs = this.filterInputs(email, password);

    let errors = this.validateInputs(inputs);

    /* S'il y a des erreurs, on les envoie au client en JSON */
    if (errors.length !== 0) {

      return {
        success: false,
        errors
      };

    } else {

      /** @todo Hash password */

      /* Données formattées finales */
      let userData = this.normalizeInputs(inputs);

      /* Requête de sélection pour vérifier si cet email existe déjà en base */
      if (this.isUserExisting(userData.email)) {

        return {
          success: false,
          errors: [`Ce compte existe déjà. Avez-vous perdu votre mot de passe ?`]
        };

      } else {

        /* Sinon insertion du nouveau compte en base */
        this.saveUser(userData);

        return {
          success: true,
          errors: []
        };

      }

    }

  }

  /**
   * @param {{ email: string; password: string; }} body
   * @returns {AccountResponse}
   */
  login(body) {

    let { email, password } = body;
    email = (typeof email === 'string') ? email : '';
    password = (typeof password === 'string') ? password : '';

    /* Filtrage des données utilisateur avec le module validator */
    let inputs = this.filterInputs(email, password);

    let errors = this.validateInputs(inputs);

    /* S'il y a des erreurs, on les envoie au client en JSON */
    if (errors.length !== 0) {

      return {
        success: false,
        errors
      };

    } else {

      let user = this.isUserExisting(inputs.email);

      if (!user) {

        return {
          success: false,
          errors: [`Ce compte n'existe pas.`]
        };

      } else {

        if (inputs.password !== user.hash) {

          return {
            success: false,
            errors: [`Mot de passe incorrect.`]
          };

        } else {

          /* Stockage des données utilisateur en session en cas de succès */
          let token = jwt.sign({
            status: true,
            email: inputs.email
          }, config.jwtSecret);

          return {
            success: true,
            errors: [],
            token
          };

        }

      }

    }

  }

  /**
   * @param {string} inputEmail
   * @returns {AccountResponse}
   */
  isAccountAvailable(inputEmail) {

    const email = (typeof inputEmail === 'string') ? validator.escape(inputEmail) : '';

    if (email && this.isUserExisting(email)) {

      return {
        success: false,
        errors: [`Ce compte existe déjà.`]
      };

    }

    return {
      success: true,
      errors: []
    };

  }

}

module.exports = Account;
