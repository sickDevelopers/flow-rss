"use strict";
const express = require('express');
const app = require('../app');
const User = require('../models/user');
const UserFlow = require('../models/user-flow');
const mongoose = require('mongoose');

const router = express.Router();

const UserController = function UserController () {}

UserController.prototype = {

  setup: function () {
  	console.log('setup UserController routes...');
    // GET
    router.get('/', ((req, res) => {
      this.list(req, res);
    }).bind(this));
    // GET USER FLOW
    router.get('/:id/flows', ((req, res) => {
      this.getUserFlows(req)
        .then((data) => {
          res.json(data)
        })
        .catch((error) => {
          res.json({error: error});
        });
    }).bind(this));

    // ADD
    router.post('/', ((req, res) => {
      this.create(req, res);
    }).bind(this));
  },

  list: (req, res) => {
    User.find().then((data) => {
      res.json(data);
    })
  },

  getUserFlows: function(req) {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      throw "Invalid user id";
    }
    let userQuery = User.findOne({
      _id: req.params.id
    });
    return userQuery.exec()
      .then((data) => {
        if(!data) {
          throw "User not found";
        }
      })
      .then(() => {
        let query = UserFlow.find({
          user_id: req.params.id
        });
        return query.exec();
      })
      .then((data) => {
        return data;
      });
  },

  create: function (req, res) {
    let newUser = new User(req.body);
    newUser.created_at = new Date();
    newUser.updated_at = new Date();
    newUser.save()
      .then((user) => {
        res.json(user)
      })
      .catch((error) => {
        res.json(error);
      });
  },

}

app.use('/users', router);
module.exports = UserController;
