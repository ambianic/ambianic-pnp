# Ambianic PnP

Ambianic Plug and Play (PnP) allows Ambianic UI users to discover local Ambianic Edge devices and control them remotely on the go.

Ambianic PnP is a NodeJS server side app that normally runs on a host with public IP which can be accessed at all times by Ambianic UI client devices and Ambianic Edge devices. It acts as a WebRTC peer discovery and signaling server.

By defauly Ambianic UI and Ambianic Edge devices use the Ambianic PnP service at pnp.ambianic.ai. It can be used for FREE by all users at home, but is not recommended for business critical application as it does not provide any strict uptime or SLA guarantees. For such cases, it is better to deploy and configure your own Ambianic PnP server.

## Project Status

Currently in early development phase. No stable releases are available yet.

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) installed.

```sh
# git clone this project from github
$ cd ambianic-pnp
$ npm install
$ npm start
```

The Ambianic PnP server should now be running on [localhost:9779](http://localhost:9779/).

## Deploying to Heroku

Click the button below to deploy to Heroku. 

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

Alternatively you can use the [Heroku CLI](https://devcenter.heroku.com/articles/getting-started-with-nodejs)

## Documentation

Not available yet.

## Acknowledgements

- Ambianic PnP was originally inspired by the awesome [ShareDrop](https://github.com/cowbell/sharedrop) project.
- [PeerJS](https://github.com/peers/peerjs) is another great source of inspiration for Ambianic PnP.

