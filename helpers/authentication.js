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



module.exports = {
  // Authorization uri definition
  githubAuthorizationUri : githubOauth2.authCode.authorizeURL({
    redirect_uri: 'http://localhost:8000/#/github-authback', //process.env.PROTOCOL + "://" + process.env.DOMAIN + ":" + process.env.PORT + "/" + process.env.GITHUB_AUTH_BACK,
    scope: 'notifications',
    state: '3(#0/!~'
  }),
  getGithubToken : githubOauth2.authCode.getToken,
  createGithubAccessToken : githubOauth2.accessToken.create

}
