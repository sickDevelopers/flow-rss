"use strict";
const express = require('express');
const url = require('url');
const app = require('../app');
const auth = require('../helpers/authentication');
const user = require('../models/user.js');
const request = require('request');

const router = express.Router();

const AuthController = function AuthController() {}

AuthController.prototype = {

  setup : function () {
    console.log('setup AuthController routes...');
    // GITHUB
    // Initial page redirecting to Github
    app.get('/github-auth', function (req, res) {
      res.json({
        auth_url: auth.githubAuthorizationUri
      })
      // request(auth.githubAuthorizationUri, function(err, result) {
      //   console.log(result.body);
      // });
    });
    // Callback service parsing the authorization token and asking for the access token
    app.post('/github-authback', function (req, res) {
    //   const self = this;
      this.handleGithubAuthBack(req, res)
        .then(function(response) {
          console.log('solved response', response);
          req.session.access_token = response.access_token;
          res.json(response);
        })
        .catch(function(error) {
          res.json(error);
        });

    //     .then(function(data) {
    //       return self.saveGithubToken(data);
    //     })
    //     .then(function(saveExit) {
    //       res.json(saveExit);
    //     })
    //     .catch(function(err) {
    //       res.json(err);
    //     })
    }.bind(this));

  },

  handleGithubAuthBack : function (req, res) {
    var code = req.body.code;
    console.log('code', code);
    return new Promise(function(resolve, reject) {
      auth.getGithubToken({
        code: code,
        redirect_uri: 'http://localhost:8000/#/github-authback' //process.env.PROTOCOL +'://'+ process.env.DOMAIN +':'+ process.env.PORT +'/github-authback'
      }, function(err, response) {
        console.log('response', response);
        console.log('err', err);
        if (err) {
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
    // token params
    // app.use(express.session({access_token: tokenParams.access_token}));
    return tokenParams.access_token;
  }

}

module.exports = AuthController;
