require('newrelic')
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');

// const morgan = require('morgan');

const PORT = 3030;
const ROOM_COMPONENT_IP_LOADBALANCER = 'http://35.155.225.182';
// console.log('ROOM_COMPONENT_IP_LOADBALANCER', ROOM_COMPONENT_IP_LOADBALANCER)

let indexHTML;

fs.readFile(path.join(__dirname, '../public/index.html'), (err, data) => {
  if (err) throw err;
  indexHTML = data;
})

const app = express();
// app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());
app.use(cors());
// app.use(morgan('dev'))


app.get('/', (req, res, next) => {
  if (indexHTML) {
    res.setHeader('Content-Type', 'text/html');
    res.send(indexHTML);
  }
})

app.get('/loaderio-d66c8240bc51cf4f478f2fc097e9d05a.html', (req, res, next) => {
  res.send('loaderio-d66c8240bc51cf4f478f2fc097e9d05a')
})

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
