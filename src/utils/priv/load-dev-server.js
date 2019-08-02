/**
 * jsore/utils/priv/load-dev-server.js
 *
 * ignored file, private function for returning dev SSL keys
 * to mimic HTTPS connection in prod, but over localhost
 */

const fs = require('fs');
const https = require('https');

const modeCheck = () => {
  if (process.env.CURRENT_ENVIRONMENT === 'dev') {

    const developmentKey = fs.readFileSync(`${process.env.DEVELOPMENT_KEY}`, 'utf8');
    const developmentCert = fs.readFileSync(`${process.env.DEVELOPMENT_CERT}`, 'utf8');
    /** CA managed by exporting NODE_EXTRA_CA_CERTS */

    const creds = { key: developmentKey, cert: developmentCert };
    return creds;
  }
};

module.exports = {
  devKeys: function(app) {
    const keys = modeCheck();
    if (keys) {
      const developmentHttpsServer = https.createServer(keys, app);
      return developmentHttpsServer.listen(443, (req, res) => {
        console.log('dev server running');
      });
    }
  }
};
