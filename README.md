# Ambianic PnP


[![NodeJS CI](https://github.com/ambianic/ambianic-pnp/workflows/Node%20CI/badge.svg)](https://github.com/ambianic/ambianic-pnp/actions?query=workflow%3A%22Node+CI%22)
[![npm version](https://badge.fury.io/js/ambianic-pnp.svg)](https://badge.fury.io/js/ambianic-pnp)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![codecov](https://codecov.io/gh/ambianic/ambianic-pnp/branch/master/graph/badge.svg)](https://codecov.io/gh/ambianic/ambianic-pnp)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fambianic%2Fambianic-pnp.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fambianic%2Fambianic-pnp?ref=badge_shield)
[![CodeFactor](https://www.codefactor.io/repository/github/ambianic/ambianic-pnp/badge)](https://www.codefactor.io/repository/github/ambianic/ambianic-pnp)


Ambianic Plug and Play (PnP) allows Ambianic UI users to discover local Ambianic Edge devices automatically and control them remotely on the go.

Ambianic PnP is a NodeJS server side app that normally runs on a host with public IP which can be accessed at all times by Ambianic UI client devices and Ambianic Edge devices. It acts as a [WebRTC peer discovery](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling) server.

By default Ambianic UI and Ambianic Edge devices use the Ambianic PnP service at pnp.ambianic.ai. The service is available for FREE to all users, but is not recommended for business critical application as it does not provide any strict uptime or SLA guarantees. For such cases, it is better to deploy and configure your own Ambianic PnP server.

Ambianic PnP does not see any of the data exchanged between users and their edge devices. Its a transient "matchmaking" service without a database layer. No user data is collected, stored and used in any way. Please feel free to inspect the code and point out (or rip out) any code that contradicts with Ambianic's main principles of privacy, transperancy and ultimate user control.

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) installed.

Create a ```sh .env ``` file and copy the content from the ```sh .env.example ``` and paste it in your .env file.

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

Not available yet. Contributors welcome!

## Acknowledgements

-   Ambianic PnP was originally inspired by the awesome [ShareDrop](https://github.com/cowbell/sharedrop) project.
-   [PeerJS](https://github.com/peers/peerjs) is another great source of inspiration for Ambianic PnP.
