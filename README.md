# DetroitNow - Node

## Dependencies
* [Nodejs](http://nodejs.org) (> 0.11.2, for harmony support)
* [Grunt](http://gruntjs.com)
* [Bower](http://bower.io)
* [MongoDB](http://www.mongodb.org/)

### Optional
* [Nodemon](http://nodemon.io/)

## Install
### Node stuff
```bash
npm install
npm install -g grunt-cli nodemon bower
bower install
```

### (MongoDB (OSX))[http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/]
#### Install[http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/]
```bash
brew install mongodb
```

#### (Launch)[http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/#run-mongodb]
```bash
# Might need 'sudo' here
mkdir -p /data/db

# Sets up as default
# Also might need a 'sudo' here
mongod
```

#### (Optional) Launch mongodb on startup
```bash
ln -sfv /usr/local/opt/mongodb/*.plist ~/Library/LaunchAgent
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
# Nodemon (for server restart on file save)
nodemon --harmony app.js

# Node
node --harmony app.js
```

Opens at ```http://localhost:3000```

## Watch js files
```bash
grunt browserify:watch
```

## Credits
* Eric Bower [https://github.com/neurosnap](https://github.com/neurosnap)
* Mike Varano [https://github.com/migreva](https://github.com/migreva)