var FeedParser = require('feedparser')
  , request = require('request')
  , q = require('q');

var RssParser = {
  parse: function(url) {
    console.log("Parsing " + url);

    var req = request(url);
    var feedparser = new FeedParser();
    var feedItems = [];
    var deferred = q.defer();

    req.on('response', function (res) {
      console.log("Parsing " + url + " : response");
      var stream = this;
      if (res.statusCode != 200) {
        deferred.reject('Bad status code ' + res.statusCode);
      }
      stream.pipe(feedparser);
    });

    req.on('error', function() {
      deferred.reject('Connection error');
    })

    feedparser.on('error', function(error) {
      console.log("Parsing " + url + " : error");
      deferred.reject(error);
    });

    feedparser.on('readable', function() {
      // This is where the action is!
      var stream = this
        , meta = this.meta // **NOTE** the "meta" is always available in the context of the feedparser instance
        , item;

      while (item = stream.read()) {
        feedItems.push(item);
      }
    });

    feedparser.on('end', function() {
      console.log("Parsing " + url + " : end");
      var meta = this.meta;
      var feedData = JSON.parse(JSON.stringify(meta));
      feedData.articles = feedItems;
      deferred.resolve(feedData);
    });

    return deferred.promise;
  }
}

module.exports = RssParser;
