# DetroitNow - Node

## Dependencies
* [Nodejs](http://nodejs.org) (> 0.11.2, for harmony support)

### Optional
* [Nodemon](http://nodemon.io/)

## Install
### Node stuff
```bash
npm install -g gulp
npm install
gulp
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
Opens at ```http://localhost:3000```

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
