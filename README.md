# Ambianic PnP

Ambianic Plug and Play (PnP) allows Ambianic UI users to discover local Ambianic Edge devices automaticallyand control them remotely on the go.

Ambianic PnP is a NodeJS server side app that normally runs on a host with public IP which can be accessed at all times by Ambianic UI client devices and Ambianic Edge devices. It acts as a [WebRTC peer discovery](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling) server.

By default Ambianic UI and Ambianic Edge devices use the Ambianic PnP service at pnp.ambianic.ai. The service is available for FREE to all users, but is not recommended for business critical application as it does not provide any strict uptime or SLA guarantees. For such cases, it is better to deploy and configure your own Ambianic PnP server.

Ambianic PnP does not see any of the data exchanged between users and their edge devices. Its a transient "matchmaking" service without a database layer. No user data is collected, stored and used in any way. Please feel free to inspect the code and point out (or rip out) any code that contradicts with Ambianic's main principles of privacy, transperancy and ultimate user control.

## Project Status

Currently in early development phase. We are a few weeks away from an initial public release.

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

You can run Ambianic PnP on many NodeJS hosting services, including Heroku. Click the button below to deploy to Heroku.

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

Alternatively you can use the [Heroku CLI](https://devcenter.heroku.com/articles/getting-started-with-nodejs)

## NPM package

Ambianic PnP is packaged and released to npmjs as [ambianic-pnp](https://www.npmjs.com/package/ambianic-pnp).

## Documentation

Not available yet.

## Acknowledgements

-   Ambianic PnP was originally inspired by the awesome [ShareDrop](https://github.com/cowbell/sharedrop) project.
-   [PeerJS](https://github.com/peers/peerjs) is another great source of inspiration for Ambianic PnP.
