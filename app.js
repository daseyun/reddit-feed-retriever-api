const express = require("express");
var request = require("request");
const bodyparser = require("body-parser");
const app = express();
const port = process.env.PORT || 3200;
module.exports = app.listen(3000);

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
// error handling. Ex. bad json format.
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).send({
      verb: req.method,
      url: req.protocol + "://" + req.headers.host + req.originalUrl,
      status: 404,
      message: err.message
    }); // Bad request
  }
  next();
});
app.listen(port, () => {
  console.log(`running at port ${port}`);
});

// ---------------------------------------------------------------------

const reddit_api_url = `https://www.reddit.com/r/{subreddit}/.json?limit={limit}`;
var objects = [];

var generateUid = function() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); // taken from stack
  }
  var uid = S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4();
  // my own to make sure its unique.

  if (objects.some(object => object.uid === uid)) {
    uid = generateUid();
  }
  return uid;
};

// ---------------------------------------------------------------------

// returns current objects.
app.get("/api", (req, res) => {
  res.status(200).send(objects);
});

// ---------------------------------------------------------------------

// fetches sanitized post information from provided subreddit.
// can be limited. otherwise defaults to reddit api default limit.
// this empties out objects. (No other directive on assignment. Assumed this would be proper).
app.get("/api/r/:name/:limit?", (req, res) => {
  const subreddit = req.params.name;
  var limit = "";
  if (req.params.limit) {
    limit = req.params.limit;
  }

  request(
    reddit_api_url.replace("{subreddit}", subreddit).replace("{limit}", limit),
    function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var posts = JSON.parse(body).data.children;

        // cleanse
        objects = [];
        posts.forEach(function(post) {
          var new_object = {
            uid: generateUid(),
            subreddit: post.data.subreddit,
            title: post.data.title,
            selftext: post.data.selftext,
            author: post.data.author,
            ups: post.data.ups,
            downs: post.data.downs,
            score: post.data.score,
            created: post.data.created,
            edited: post.data.edited,
            num_comments: post.data.num_comments,
            url: post.data.url,
            permalink: post.data.permalink
          };
          objects.push(new_object);
        });

        // do more stuff
        res.send(objects);
      }
    }
  );
});

// ---------------------------------------------------------------------

// fetches links to all json objects stored currently without uid provided.
// fetches specified json object with matching uid.
app.get("/api/objects/:uid?", (req, res) => {
  const object_uid = req.params.uid;

  if (!object_uid) {
    var objects_link = [];
    objects.forEach(function(object) {
      objects_link.push({
        url:
          req.protocol + "://" + req.headers.host + "/api/objects/" + object.uid
      });
    });
    res.status(200).send(objects_link);
    return;
  }

  for (let i = 0; i < objects.length; i++) {
    if (objects[i].uid === object_uid) {
      res.status(200).send(objects[i]);
      return;
    }
  }
  res.status(404).json({ message: "Invalid Object Uid" });
});

// ---------------------------------------------------------------------

// posts new object with new uid.
app.post("/api/objects", (req, res) => {
  const object = req.body;
  objects.push({
    ...object,
    uid: generateUid()
  });

  res.status(200).send(objects[objects.length - 1]);
});

// ---------------------------------------------------------------------

// updates object with matching uid with provided json.
app.put("/api/objects/:uid", (req, res) => {
  const object_uid = req.params.uid;
  const object_update = req.body;

  for (let i = 0; i < objects.length; i++) {
    if (objects[i].uid === object_uid) {
      objects[i] = object_update;
      objects[i].uid = object_uid; // TODO: necessary?

      return res.status(200).send(objects[i]);
    }
  }
  res.status(404).json({ message: "Invalid Object Uid" });
});

// ---------------------------------------------------------------------

// deletes object with matching uid.
app.delete("/api/objects/:uid", (req, res) => {
  const object_uid = req.params.uid;

  for (let i = 0; i < objects.length; i++) {
    if (objects[i].uid == object_uid) {
      objects.splice(i, 1);
      return res.status(200).send();
    }
  }
  res.status(404).json({ message: "Invalid Object Uid" });
});
