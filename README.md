# DashBeat

Gannett's chartbeat analytic dashboard web app.

## Dependencies
* [Node](http://nodejs.org)

## Install

### Config file

Client side javascript requires a market specific configuration file.

In the base dashbeat directory create a file `config.js` with the following:

```node
"use strict";

module.exports = require('./config/<marketName>');
//module.exports = require('./config/michigan');
//module.exports = require('./config/usat');
```

### Node stuff

## Install
```bash
npm install -g gulp
npm install
```

## Compile
*NOTE: Make sure you made a [config file](https://github.com/michigan-com/dashbeat#config-file) first!*

```bash
gulp
```

There's a lot of static files on this sucker, so if you want, you can run `gulp watch` and just compile the files you need.

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
