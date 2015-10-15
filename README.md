# DetroitNow (http://new.detroitnow.io)

## Dependencies
* [Nodejs](http://nodejs.org) (> 0.11.2, for harmony support)

## Install
### Node stuff
```bash
npm install -g gulp
npm install
gulp
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
docker run -d -p 3000:3000 -v /Users/dev/dashbeat:/srv --name dashbeat dashbeat/app
```
