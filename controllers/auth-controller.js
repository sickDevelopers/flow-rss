"use strict";
const express = require('express');
const url = require('url');
const app = require('../app');
const auth = require('../helpers/authentication');
const user = require('../models/user.js');

const router = express.Router();

const AuthController = function AuthController() {}

AuthController.prototype = {

  setup : function () {
    console.log('setup AuthController routes...');
    // GITHUB
    // Initial page redirecting to Github
    app.get('/github-auth', function (req, res) {
      res.redirect(auth.githubAuthorizationUri);
    });
    // Callback service parsing the authorization token and asking for the access token
    app.get('/' + process.env.GITHUB_AUTH_BACK, function (req, res) {
      const self = this;
      this.handleGithubAuthBack(req, res)
        .then(function(data) {
          console.log('HAVE TO SAVE');
          console.log(data);
        })
    }.bind(this));

  },

  handleGithubAuthBack : function (req, res) {

    var code = req.query.code;
    console.log('CODE', code);

    return new Promise(function(resolve, reject) {
      auth.getGithubToken({
        code: code,
        redirect_uri: process.env.PROTOCOL +'://'+ process.env.DOMAIN +':'+ process.env.PORT +'/github-authback'
      }, function(err, res) {
        if (err !== null) {
          return reject(err);
        }
        return resolve(res);
      });
    });


  },

  saveGithubToken : function (err, result) {
    if (err !== null) {
      console.log('Access Token Error', err.message);
    }
    const token = auth.createGithubAccessToken(result);
    console.log(token);
  }

}

module.exports = AuthController;
