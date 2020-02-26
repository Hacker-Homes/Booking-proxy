require('newrelic')
const express = require('express');
const proxy = require('http-proxy-middleware');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const morgan = require('morgan');

const PORT = 3030;
const ROOM_COMPONENT_IP_LOADBALANCER = 'http://35.155.225.182:5555';
console.log('ROOM_COMPONENT_IP_LOADBALANCER', ROOM_COMPONENT_IP_LOADBALANCER)

const app = express();
app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'))

app.get('/room', (req, res, next) => {
  axios.get(ROOM_COMPONENT_IP_LOADBALANCER + req.url)
    .then((response) => {
      res.send(response.data);
    })
    .catch(e => res.sendStatus(500))
})

// for (route of routes) {
//   app.use(route.route,
//     proxy({
//       target: route.address,
//       pathRewrite: (path, req) => {
//         return path.split('/').slice(2).join('/');
//       }
//     })
//   );
// }

// {
//   "routes": [
//   {
//     "route": "/booking",
//     "address": "http://44.233.161.53:5555/booking"
//   },
//   {
//     "route": "/room",
//     "address": "http://44.233.161.53:5555/room"
//   }
// ]
// }

app.listen(PORT, () => {
  console.log(`Proxy listening on port ${PORT}`);
});
