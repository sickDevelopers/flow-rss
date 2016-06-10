"use strict";
const express = require('express');
const app = require('../app');
const UserFlow = require('../models/user-flow');

const router = express.Router();

const FlowController = function FlowController () {}

FlowController.prototype = {

  setup: function () {
  	console.log('setup UserController routes...');
    // GET
    router.get('/:id', ((req, res) => {
      this.list(req, res);
    }).bind(this));
    // ADD
    router.post('/', ((req, res) => {
      this.create(req, res);
    }).bind(this));
    // ADD FEED
    router.post('/:id/feeds', ((req, res) => {
      this.addFeedToUserFlow(req, res)
        .then((result) => {
          res.json(result);
        })
        .catch((error) => {
          res.json({error: error})
        });
    }).bind(this));
  },

  list: (req, res) => {
    UserFlow.find()
      .then((data) => {
        res.json(data);
      })
  },

  create: function (req, res) {
    let userFlow = new UserFlow(req.body);
    userFlow.feeds = [];
    userFlow.flow = {};
    userFlow.created_at = new Date();
    userFlow.updated_at = new Date();
    userFlow.save()
      .then((flow) => {
        res.json(user)
      })
      .catch((error) => {
        res.json(error);
      });
  },

  addFeedToUserFlow: function (req, res) {
    // req.body = { url }
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      throw "Invalid flow id";
    }
    let flowQuery = UserFlow.findById(req.params.id);
    return flowQuery.exec()
      .then((flow) => {
        if(flow) {
            return flow.addFeed(req.body.url);
        }
        throw "No user flow found";
      })
  }

}

app.use('/flows', router);
module.exports = FlowController;
