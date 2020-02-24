import { check, sleep } from 'k6';
import http from 'k6/http';


export default function() {
  const res = http.get(
    `http://127.0.0.1:3030/?id=${Math.floor(Math.random() * 10000000)}`);
    check(res, {
      'is status 200': r => r.status === 200,
      'transaction time OK': r => r.timings.duration < 200,
    });
  }

export const options = {
  vus: 10,
  duration: '30s',
};
  