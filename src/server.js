const express = require('express');
const app = express();

const HOST = 'localhost';
const PORT = '3000';

const bodyParser = require('body-parser');
const errors = require('./errors');

require('dotenv').config();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(require('cors')());
app.use(require('./api'));
app.use(errors.commonErrorHandler);

app.listen(PORT, HOST, () => {
  console.log(`🌏 Server running at ${HOST}:${PORT}`);
});
