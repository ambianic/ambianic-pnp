const { Errors } = require('../../../enums');

module.exports = ({ config, realm }) => (req, res, next) => {
  const { id, token, key } = req.params;

  /*
  console.log('middleware: id %s , token %s, key %s',
    id, token, key)

  console.log('middleware: req.originalUrl %s',
    req.originalUrl)

  console.log('middleware: req.params %s',
    req.params)
  */

  if (key !== config.key) {
    console.warn('Invalid key %s in request %s', key, req.originalUrl)
    return res.status(401).send(Errors.INVALID_KEY);
  }

  if (!id) {
    console.warn('Invalid client id %s in request %s', id, req.originalUrl)
    return res.sendStatus(401);
  }

  const client = realm.getClientById(id);

  if (!client) {
    console.warn('Client id %s not found in server realm. Request url: %s',
      id, req.originalUrl)
    return res.sendStatus(401);
  }

  if (client.getToken() && token !== client.getToken()) {
    console.warn('Invalid token %s for client id %s', token, id)
    return res.status(401).send(Errors.INVALID_TOKEN);
  }

  next();
};
