const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const publicContent = require('../../app.json');

module.exports = ({
  config,
  realm,
  messageHandler
}) => {
  const authMiddleware = require('./middleware/auth')({
    config,
    realm
  });

  const app = express.Router();

  const jsonParser = bodyParser.json();

  app.use(cors());

  app.get('/', (req, res) => {
    res.send(publicContent);
  });

  /*
   * Handle 404 error
   */
  // app.use('*', (req, res) => {
  //   res.status(404).json({
  //     errors: {
  //       msg: 'URL_NOT_FOUND'
  //     }
  //   })
  // })

  app.use('/:key', require('./v1/public')({
    config,
    realm
  }));
  app.use('/:key/:id/:token', authMiddleware, jsonParser, require('./v1/calls')({
    realm,
    messageHandler
  }));
  // console.log('realm', realm)
  app.use('/:key/:id/:token/room', authMiddleware, jsonParser, require('./v1/rooms')({
    realm
  }));

  return app;
};