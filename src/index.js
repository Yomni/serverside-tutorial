const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const PORT = 3000;
const HOST = 'localhost';

require('dotenv').config();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(require('./api'));

app.listen(PORT, HOST, () => {
  console.log(`🌏 Server running at ${HOST}:${PORT}`);
});
