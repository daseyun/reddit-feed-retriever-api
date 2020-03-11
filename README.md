# reddit-feed-retriever

API for retrieving sanitized reddit posts information based on subreddit selection.
After retrieval, crud operation can be performed on the arbitrary json objects.

## Stack
Implemented using Express/Node
Tested via Mocha/Chai

## Heroku
Hosted here: https://reddit-feed-retriever-api.herokuapp.com/api/
To test features below, replace 'localhost:3200' with 'reddit-feed-retriever-api.herokuapp.com'.

## Installation

Clone the project, install node.js and npm.

cd into the project and use npm to install the project. This will take care of all dependencies.

```bash
npm install
```

## Usage

Start local server on port 3200.

```bash
npm start
```

Open [http://localhost:3200/api](http://localhost:3200/api).

All json objects have a unique 32 character identifier which can be used to reference them.

### • Retrieve posts from subreddit with an optional limit on posts.

[/api/r/<SUBREDDIT>/<LIMIT>](http://localhost:3200/api/r/news/)

This retrieves hot posts from the subreddit. If no limit is provided, it uses default number based on the reddit api.

| WARNING: This overwrites the entire objects store. |
| -------------------------------------------------- |


ex. [http://localhost:3200/api/r/news/1](http://localhost:3200/api/r/news/1)

response:

```json
[
  {
    "uid": "524288584c77b61f5ae41e2956551c29",
    "subreddit": "news",
    "title": "COVID-19 Megathread #5",
    "selftext": "**This post is updated daily.**\n\n&amp...",
    "author": "RNews_Mod",
    "ups": 273,
    "downs": 0,
    "score": 273,
    "created": 1583877524,
    "edited": 1583860422,
    "num_comments": 1373,
    "url": "https://www.reddit.com/r/news/comments/fge7ve/covid19_megathread_5/",
    "permalink": "/r/news/comments/fge7ve/covid19_megathread_5/"
  },
  {
    "uid": "a263c72ea9419b8341db076034de5f8f",
    "subreddit": "news",
    "title": "Alex Jones arrested for DWI in Travis County",
    "selftext": "",
    "author": "Austin63867",
    "ups": 77418,
    "downs": 0,
    "score": 77418,
    "created": 1583895331,
    "edited": false,
    "num_comments": 4517,
    "url": "https://cbsaustin.com/news/local/alex-jones-arrested-for-dwi-in-travis-county",
    "permalink": "/r/news/comments/fgiwae/alex_jones_arrested_for_dwi_in_travis_county/"
  }
]

```

### • Retrieve urls of all json objects.

[/api/objects/](http://localhost:3200/api/objects/)

response:

```json
[
  {
    "url": "http://localhost:3200/api/objects/524288584c77b61f5ae41e2956551c29"
  },
  {
    "url": "http://localhost:3200/api/objects/a263c72ea9419b8341db076034de5f8f"
  }
]
```

### • Retrieve specific object.

[/api/objects/<UID>](http://localhost:3200/api/objects/).

ex. [http://localhost:3200/api/objects/a263c72ea9419b8341db076034de5f8f](http://localhost:3200/api/objects/a263c72ea9419b8341db076034de5f8f)

response:

```json
{
  "uid": "a263c72ea9419b8341db076034de5f8f",
  "subreddit": "news",
  "title": "Alex Jones arrested for DWI in Travis County",
  "selftext": "",
  "author": "Austin63867",
  "ups": 77418,
  "downs": 0,
  "score": 77418,
  "created": 1583895331,
  "edited": false,
  "num_comments": 4517,
  "url": "https://cbsaustin.com/news/local/alex-jones-arrested-for-dwi-in-travis-county",
  "permalink": "/r/news/comments/fgiwae/alex_jones_arrested_for_dwi_in_travis_county/"
}
```

### • Add json object.

Post request to: [http://localhost:3200/api/objects/](http://localhost:3200/api/objects/).

ex.

```bash
curl -i -X POST -H 'Content-Type: application/json' -d '{"name": "New item", "year": "2009"}' http://localhost:3200/api/objects
```

response:

```json
{
  "name": "New item",
  "year": "2009",
  "uid": "cca95ea22091390295813510d7142e3f"
}
```

### • Update existing json object.

Put request to: [http://localhost:3200/api/objects/<UID>](http://localhost:3200/api/objects/).

ex.

```bash
curl -i -X PUT -H 'Content-Type: application/json' -d '{"name": "updated_obj", "count": 13}' http://localhost:3200/api/objects/cca95ea22091390295813510d7142e3f
```

response:

```json
{
  "name": "updated_obj",
  "count": 13,
  "uid": "cca95ea22091390295813510d7142e3f"
}
```

### • Delete existing json object.

Delete request to: [http://localhost:3200/api/objects/<UID>](http://localhost:3200/api/objects/).

ex.

```bash
curl -i -X DELETE http://localhost:3200/api/objects/cca95ea22091390295813510d7142e3f
```

response:

```json

```

## Errors

All errors regarding malformed json in POST/PUT requests, request for objects that do not exist, etc. are handled and will be responded with an example error message similar to:

```json
{
  "verb": "PUT",
  "url": "http://localhost:3200/api/objects/cca95ea22091390295813510d7142e3f",
  "status": 404,
  "message": "Unexpected token a in JSON at position 31"
}
```

or

```json
{ "message": "Invalid Object Uid" }
```

## Testing

```bash
npm test
```

## Future work

Some future work I'd like to add upon the project includes: more testing(had trouble mimicking malformed json objects), ability to handle multiple objects in post requests, fetching posts from subreddits do not overwrite user posted objects, etc -- would require certain keys in json), more interaction with reddit api -- voting, commenting, user lookups, etc.
