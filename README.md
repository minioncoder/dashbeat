# DashBeat

Gannett's chartbeat analytic dashboard web app.

## Dependencies
* [Node](http://nodejs.org)

## Install

### Config file

Client side javascript requires a URL for the websocket connection.

In the base dashbeat directory:

```bash
cp config_default.js config.js
```

Then update the URL with the proper websocket URL, ex:

```node
"use strict";
module.exports = { "socketUrl": "http://api.thepul.se" };
```

### Node stuff

```bash
npm install -g gulp
npm install
```

## Run

```bash
DEBUG=app:* npm start
```

Opens at `http://localhost:3000`

## Docker

```bash
docker build -t dashbeat/app .
docker run -d -p 3000:3000 -v /Users/dev/dashbeat:/srv --name dashbeat dashbeat/app
```
