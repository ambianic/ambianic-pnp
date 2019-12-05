module.exports = {
  port: 9779,
  expire_timeout: 5000,
  alive_timeout: 60000,
  key: 'ambianic-pnp',
  path: '/',
  concurrent_limit: 5000,
  allow_discovery: false,
  proxied: false,
  cleanup_out_msgs: 1000,
  ssl: {
    key: '',
    cert: ''
  }
};
