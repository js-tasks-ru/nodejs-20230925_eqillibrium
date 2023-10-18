const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

const isNested = (targetPath) => targetPath.includes('/');

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  if (isNested(pathname)) {
    res.statusCode = 400;
    res.end('Nested routes are not supported');
  }

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':

      const fileReadStream = fs.createReadStream(filepath);
      fileReadStream.pipe(res);

      fileReadStream.on('error', () => {
        res.statusCode = 404;
        res.end('Not found');
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
