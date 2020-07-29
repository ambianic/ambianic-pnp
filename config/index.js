module.exports = {
  port: 9779,
  expire_timeout: process.env.EXPIRE_TIMEOUT,
  alive_timeout: process.env.ALIVE_TIMEOUT,
  key: process.env.KEY,
  path: '/',
  concurrent_limit: process.env.CONCURRENT_LIMIT,
  allow_discovery: false,
  proxied: false,
  cleanup_out_msgs: process.env.CLEANOUT_MSGS,
  ssl: {
    key: process.env.SSL_KEY,
    cert: process.env.SSL_CERT
  }
};