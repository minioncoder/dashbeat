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
npm install -g gulp bower babel browserify
npm install
bower install
gulp
```

### [MongoDB (OSX)](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/)
#### [Install](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/)
```bash
brew install mongodb
```

#### [Launch](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/#run-mongodb)
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

## Configure
To start pulling data from chartbeat, we need to create a user with an
API key and associated hosts.  The easiest way to create a user for development:
```
gulp addUser
```

This requires a `config.js` file to be added to the base directory:
```
module.exports = {
    apikey: '1234567890',
    hosts: [
        "detroitnews.com",
        "freep.com",
        "battlecreekenquirer.com",
        "hometownlife.com",
        "lansingstatejournal.com",
        "livingstondaily.com",
        "thetimesherald.com",
    ]
};
```

## Run
```bash
npm start
```

Without an environment variable `DASHBEAT_DB` pointing to the DB URI then it will
default to: mongodb://localhost:27017/dashbeat

To change the default database:
```
DASHBEAT_DB=mongodb://localhost:27017/beat npm start
```

## Debugging
```
DEBUG=app:* npm start
```

#### Docker
```
docker build -t dashbeat/app .
docker run -d -p 5000:5000 -v /Users/dev/dashbeat:/srv --name dashbeat dashbeat/app
```

Opens at `http://localhost:5000`

## Credits
* Eric Bower [https://github.com/neurosnap](https://github.com/neurosnap)
* Mike Varano [https://github.com/migreva](https://github.com/migreva)
