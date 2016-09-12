"use strict";
const express = require('express');
const url = require('url');
const app = require('../app');
const auth = require('../helpers/authentication');
const User = require('../models/user.js');
const request = require('request-promise');

const router = express.Router();

const AuthController = function AuthController() {}

AuthController.prototype = {

  setup: function() {
    console.log('setup AuthController routes...');
    // GITHUB
    //
    app.get('/github-auth', function(req, res) {
      res.json({
        auth_url: auth.githubAuthorizationUri
      })
    });
    //
    app.post('/github-authback', function(req, res) {
      //   const self = this;
      this.handleGithubAuthBack(req, res)
        .then(function(response) {
          // save access token in session
          req.session.access_token = response.access_token;
          // get user from github
          User.createOauthUser(req.session.access_token)
            .then(function(user) {
              console.log('user', user);
              // save user in session
              req.session.user = user;
              // return access token to frontend
              res.send(response);
            })
            .catch(function(err) {
              res.status(400).send(err);
            })
        })
        .catch(function(error) {
          res.json(error);
        });
    }.bind(this));
  },

  handleGithubAuthBack: function(req, res) {
    var code = req.body.code;
    return new Promise(function(resolve, reject) {
      auth.getGithubToken({
        code: code,
        redirect_uri: 'http://' + process.env.DOMAIN + ':' + process.env.FE_PORT + '/#/github-authback' //process.env.PROTOCOL +'://'+ process.env.DOMAIN +':'+ process.env.FE_PORT +'/github-authback'
      }, function(err, response) {
        if (err !== null) {
          return reject(err);
        }
        var params = {};
        response.split('&').forEach(function(couple) {
          params[couple.split('=')[0]] = couple.split('=')[1];
        });
        if (params.error) {
          return reject(params.error_description);
        }
        return resolve(params);
      });
    });
  },



}

module.exports = AuthController;
