require('newrelic');
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');

// const morgan = require('morgan');

const PORT = 3030;
const ROOM_COMPONENT_IP_LOADBALANCER = 'http://35.155.225.182';
const LISTING_COMPONENT_IP_LOADBALANCER = 'http://34.215.142.111';
const REVIEWS_COMPONENT_IP_LOADBALANCER = 'http://44.233.243.134';
// console.log('ROOM_COMPONENT_IP_LOADBALANCER', ROOM_COMPONENT_IP_LOADBALANCER)

let indexHTML;
let styleCSS;

fs.readFile(path.join(__dirname, '../public/index.html'), (err, data) => {
  if (err) throw err;
  indexHTML = data;
});

fs.readFile(path.join(__dirname, '../public/style.css'), (err, data) => {
  if (err) throw err;
  styleCSS = data;
});

const app = express();
// app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());
app.use(cors());
// app.use(morgan('dev'))

// ROOM API
// app.get('/', (req, res, next) => {
//   if (indexHTML) {
//     res.setHeader('Content-Type', 'text/html');
//     res.send(indexHTML);
//   }
// });

app.get('/', (req, res, next) => {
  if (indexHTML) {
    res.setHeader('Content-Type', 'text/html');
    
    const roomPromise = axios.get(ROOM_COMPONENT_IP_LOADBALANCER + '/room?id=' + req.query.id)
      .then((response) => {
        return response.data
      })
      .catch((e) => res.sendStatus(500)); 
    
    const listingPromise = axios.get(LISTING_COMPONENT_IP_LOADBALANCER + '/api/listing/' + req.query.id)
      .then((response) => {
        return response.data
      })
      .catch((e) => res.sendStatus(500)); 
    
    const reviewsPromise = axios.get(REVIEWS_COMPONENT_IP_LOADBALANCER + '/api/reviews/' + req.query.id)
      .then((response) => {
        return response.data
      })
      .catch((e) => res.sendStatus(500)); 
  
    const PromiseArray = [ roomPromise, listingPromise, reviewsPromise ];

    Promise.all(PromiseArray)
      .then( values => {
        res.send(indexHTML)
      })
      .catch((e) => res.sendStatus(500)); 
  }
});


app.get('/index.html', (req, res, next) => {
  if (indexHTML) {
    res.setHeader('Content-Type', 'text/html');
    res.send(indexHTML);
  }
});

app.get('/style.css', (req, res, next) => {
  if (styleCSS) {
    res.setHeader('Content-Type', 'text/css');
    res.send(styleCSS);
  }
});

// app.get('/room', (req, res, next) => {
//   axios
//     .get(ROOM_COMPONENT_IP_LOADBALANCER + req.url)
//     .then((response) => {
//       res.send(response.data);
//     })
//     .catch((e) => res.sendStatus(500));
// });

app.get('/room', (req, res, next) => {
  axios
    .get(ROOM_COMPONENT_IP_LOADBALANCER + req.url)
    .then((response) => {
      res.send(response.data);
    })
    .catch((e) => res.sendStatus(500));
});

app.get('/loaderio-d66c8240bc51cf4f478f2fc097e9d05a.html', (req, res, next) => {
  res.send('loaderio-d66c8240bc51cf4f478f2fc097e9d05a');
});

// LISTING API
app.get('/api/listing/:id', (req, res, next) => {
  console.log('api listing');
  console.log('listing api:', LISTING_COMPONENT_IP_LOADBALANCER + req.url);
  axios
    .get(LISTING_COMPONENT_IP_LOADBALANCER + req.url)
    .then((response) => {
      res.send(response.data);
    })
    .catch((e) => res.sendStatus(500));
});

// REVIEWS API
app.get('/api/reviews/:id', (req, res, next) => {
  console.log('reviews api:', REVIEWS_COMPONENT_IP_LOADBALANCER + req.url);
  axios
    .get(REVIEWS_COMPONENT_IP_LOADBALANCER + req.url)
    .then((response) => {
      res.send(response.data);
    })
    .catch((e) => res.sendStatus(500));
});

//http: // for (route of routes) {
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
