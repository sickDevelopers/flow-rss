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
          return self.saveGithubToken(data);
        })
        .then(function(saveExit) {
          res.json(saveExit);
        })
        .catch(function(err) {
          res.json(err);
        })
    }.bind(this));

  },

  handleGithubAuthBack : function (req, res) {
    var code = req.query.code;
    return new Promise(function(resolve, reject) {
      auth.getGithubToken({
        code: code,
        redirect_uri: process.env.PROTOCOL +'://'+ process.env.DOMAIN +':'+ process.env.PORT +'/github-authback'
      }, function(err, res) {
        if (err) {
          return reject(err);
        }
        return resolve(res);
      });
    });
  },

  saveGithubToken : function (queryParams) {
    const params = {};
    const tokenObj = auth.createGithubAccessToken(queryParams);
    const tokenParams = {};
    // check for errors in queryParams
    queryParams.split('&').forEach(function(couple) {
      params[couple.split('=')[0]] = couple.split('=')[1];
    });
    if (params.error) {
      throw params.error_description;
    }
    // parse access Token uri
    tokenObj.token.split('&').forEach(function(couple) {
      tokenParams[couple.split('=')[0]] = couple.split('=')[1];
    });
    // tonek params
    return tokenParams;
  }

}

module.exports = AuthController;
