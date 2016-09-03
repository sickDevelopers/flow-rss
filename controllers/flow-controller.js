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
    // GET all
    // TODO adapt to use authentication
    router.get('/all', ((req, res) => {
      this.list(req, res);
    }).bind(this));
    // ADD
    router.post('/', ((req, res) => {
      this.create(req, res);
    }).bind(this));
    // ADD FEED
    router.post('/:id/feeds', ((req, res) => {
      this.addFeedToUserFlow(req)
        .then((result) => {
          res.json(result);
        })
        .catch((error) => {
          res.json({error: error})
        });
    }).bind(this));
    // DIGEST
    router.get('/:id/digest', ((req, res) => {
      this.buildDigest(req)
        .then((data) => {
          res.json(data)
        })
        .catch((error) => {
          res.json({error:error});
        });
    }).bind(this));
    // SEND FLOW
    router.get('/:id/send', ((req, res) => {
      this.sendFlow(req)
        .then((data) => {
          res.json(data);
        })
        .catch((error) => {
          res.json({error: error});
        })
    }).bind(this));
    // PREVIEW FLOW
    router.get('/:id/preview', ((req, res) => {
      this.previewFlow(req)
        .then((data) => {
          res.send(data.html);
        })
        .catch((error) => {
          res.json({error: error});
        })
    }).bind(this));
    // DELETE FEED
    router.delete('/:id/feeds', ((req, res) => {
      this.deleteFeedOnUserFlow(req)
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
    // set current day of the week as cron schedule
    userFlow.interval = 'weekly';
    userFlow.save()
      .then((flow) => {
        res.json(user)
      })
      .catch((error) => {
        res.json(error);
      });
  },

  addFeedToUserFlow: function (req) {
    // req.body = { url }
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      throw "Invalid flow id";
    }
    let flowQuery = UserFlow.findById(req.params.id);
    return flowQuery.exec()
      .then((flow) => {
        console.log('adding feed to '+ req.params.id + ' flow' );
        if(flow) {
            return flow.addFeed(req.body.url);
        }
        throw "No user flow found";
      })
  },

  deleteFeedOnUserFlow: function (req) {
    // req.body = { url }
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      throw "Invalid flow id";
    }
    let flowQuery = UserFlow.findById(req.params.id);
    return flowQuery.exec()
      .then((flow) => {
        console.log('removing feed to '+ req.params.id + ' flow' );
        if(flow) {
            return flow.deleteFeed(req.body.url);
        }
        throw "No user flow found";
      })
  },

  buildDigest: function (req, res) {
    // req.body = { }
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      throw "Invalid flow id";
    }
    let flowQuery = UserFlow.findById(req.params.id);
    return flowQuery.exec()
      .then((flow) => {
        if(flow) {
          return flow.buildDigest();
        }
        throw "Invalid flow id";
      });
  },

  sendFlow: function (req) {
    let flowQuery = UserFlow.findById(req.params.id);
    return flowQuery.exec()
      .then((flow) => {
        if(flow) {
          return flow.send();
        }
        throw "User flow not found";
      })
  },

  previewFlow : function (req) {
    let flowQuery = UserFlow.findById(req.params.id);
    return flowQuery.exec()
      .then((flow) => {
        if(flow) {
          return flow.preview();
        }
        throw "User flow not found";
      })
  }

}

app.use('/flows', router);
module.exports = FlowController;
