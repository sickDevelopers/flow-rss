"use strict";
const express = require('express');
const app = require('../app');

const oauth2 = require('simple-oauth2')({
  clientID: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  site: 'https://github.com/login',
  tokenPath: '/oauth/access_token',
  authorizationPath: '/oauth/authorize'
});

// Authorization uri definition
var authorization_uri = oauth2.authCode.authorizeURL({
  redirect_uri: 'http://localhost:3000/authback',
  scope: 'notifications',
  state: '3(#0/!~'
});

// Initial page redirecting to Github
app.get('/auth', function (req, res) {
    res.redirect(authorization_uri);
});

// Callback service parsing the authorization token and asking for the access token
app.get('/authback', function (req, res) {
  var code = req.query.code;

  oauth2.authCode.getToken({
    code: code,
    redirect_uri: 'http://localhost:3000/callback'
  }, saveToken);

  function saveToken(error, result) {
    if (error) { console.log('Access Token Error', error.message); }
    token = oauth2.accessToken.create(result);
  }
});
