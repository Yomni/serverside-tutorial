const todo = require('./todo');
const router = require('express').Router();

router.use('/todo', todo);

module.exports = router;
