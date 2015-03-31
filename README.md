# DetroitNow - Node

## Dependencies
* [Nodejs](http://nodejs.org) (> 0.11.2, for harmony support)
* [Grunt](http://gruntjs.com)
* [Bower](http://bower.io)
* [Nodemon](http://nodemon.io/)

## Install
```bash
npm install
npm install -g grunt-cli nodemon bower
bower install
```

## Setup
* Create a config.js file with the following contents
```javascript
module.exports = {
  api_key: '...', // Chartbeat API key
  sites: [...] // list of sites to look at chartbeat info for
}
```

## Run
```bash
nodemon --harmony app.js
```

Opens at ```http://localhost:3000```

## Watch js files
```bash
grunt browserify:watch
```

## Credits
* Eric Bower [https://github.com/neurosnap](https://github.com/neurosnap)
* Mike Varano [https://github.com/migreva](https://github.com/migreva)