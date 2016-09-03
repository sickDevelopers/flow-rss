"use strict";
const express = require('express');
const app = require('../app');

const githubOauth2 = require('simple-oauth2')({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  site: 'https://github.com/login',
  tokenPath: '/oauth/access_token',
  authorizationPath: '/oauth/authorize'
});

// Callback service parsing the authorization token and asking for the access token
app.get('/authback', function (req, res) {
  var code = req.query.code;

  githubOauth2.authCode.getToken({
    code: code,
    redirect_uri: 'http://localhost:3000/callback'
  }, saveToken);

  function saveToken(error, result) {
    if (error) { console.log('Access Token Error', error.message); }
    token = oauth2.accessToken.create(result);
  }
});

module.exports = {
  // Authorization uri definition
  githubAuthorizationUri : githubOauth2.authCode.authorizeURL({
    redirect_uri: process.env.PROTOCOL + "://" + process.env.DOMAIN + ":" + process.env.PORT + "/" + process.env.GITHUB_AUTH_BACK,
    scope: 'notifications',
    state: '3(#0/!~'
  }),
  getGithubToken : githubOauth2.authCode.getToken,
  createGithubAccessToken : githubOauth2.accessToken.create

}
