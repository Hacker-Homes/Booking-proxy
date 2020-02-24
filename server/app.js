require('newrelic')
const express = require('express');
const proxy = require('http-proxy-middleware');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const PORT = 3030

const { routes } = require('./config.json');


const app = express();
app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());
app.use(cors());

for (route of routes) {
  app.use(route.route,
    proxy({
      target: route.address,
      pathRewrite: (path, req) => {
        return path.split('/').slice(2).join('/');
      }
    })
  );
}

app.listen(PORT, () => {
  console.log(`Proxy listening on port ${PORT}`);
});
