const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const { PORT } = process.env;
const HOST = 'localhost';

require('dotenv').config();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(cors());
app.use(require('./api'));

app.listen(PORT, HOST, () => {
  console.log(`🌏 Server running at ${HOST}:${PORT}`);
});
