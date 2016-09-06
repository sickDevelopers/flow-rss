"use strict";
const express = require('express');
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
    app.get('/' + process.env.GITHUB_AUTH_BACK, (function (req, res) {
      this.handleGithubAuthBack(req, res);
    }).bind(this));

    // Callback service parsing the authorization token and asking for the access token
    app.get('/github-authback', function (req, res) {
      var code = req.query.code;

      githubOauth2.authCode.getToken({
        code: code,
        redirect_uri: 'http://localhost:5000/github-authback'
      }, saveToken);

      function saveToken(error, result) {
        if (error) {
          console.log('Access Token Error', error.message);
        }

        // TODO save token in user db
        var token = githubOauth2.accessToken.create(result);
        User.createOauthUser(token)
          .then(function() {
            
          });

      }
    });

  },

  handleGithubAuthBack : function (req, res) {
    const code = req.params.code;
    auth.getGithubToken({
      code: code,
      redirect_uri: process.env.PROTOCOL +'://'+ process.env.DOMAIN +':'+ process.env.PORT +'/callback'
    }, this.saveGithubToken);
  },

  saveGithubToken : function (err, res) {
    if (error) {
      console.log('Access Token Error', error.message);
    }
    const token = createGithubAccessToken(result);
  }

}

module.exports = AuthController;
