const mysql = require('mysql');
const logger = require('../logger');
const { host, user, port, database, timezone } = process.env;
const pool = mysql.createPool({
  host,
  user,
  port,
  database,
  timezone,
  connectionLimit: 10
});

const handleError = err => {
  logger.error(err);
  throw Error(err);
};

const retrieveTodo = async (req, res, next) => {
  const selectStmt = 'SELECT * FROM todos';
  pool.getConnection((err, connection) => {
    err && handleError(err);
    connection.query(selectStmt, (err, result) => {
      err && handleError(err);
      logger.info(selectStmt);
      res.status(200).json(result);
      connection.release();
    });
  });
};

const createTodo = (req, res, next) => {
  const { task } = req.body;
  if (!task) {
    logger.error(`task is not defined`);
    res.sendStatus(400);
    return;
  }
  let insertStmt = 'INSERT INTO todos (task) VALUES (?)';
  let selectStmt = 'SELECT * FROM todos WHERE id = (?)';
  insertStmt = mysql.format(insertStmt, [task]);
  pool.getConnection((err, connection) => {
    err && handleError(err);
    connection.query(insertStmt, (err, result) => {
      err && handleError(err);
      logger.info(insertStmt, task);
      const { insertId } = result;
      // 생성된 ID를 받아옴
      selectStmt = mysql.format(selectStmt, [insertId]);
      connection.query(selectStmt, (err, result) => {
        err && handleError(err);
        logger.info(selectStmt, insertId);
        res.status(200).json(result);
        connection.release();
      });
    });
  });
};

const updateTodo = (req, res, next) => {
  const { id, ...data } = req.body;
  if (!id || !Object.keys(data).length) {
    logger.error(`id and todo data are not defined`);
    res.sendStatus(400);
    return;
  }
  const setValues = Object.keys(data).map(key => `${key} = "${data[key]}"`);
  const updateStmt = toSet => `UPDATE todos SET ${toSet} WHERE id = ?`;
  const selectStmt = mysql.format('SELECT * FROM todos WHERE id = (?)', [id]);
  pool.getConnection((err, connection) => {
    err && handleError(err);
    connection.query(updateStmt(setValues), [id], (err, result) => {
      err && handleError(err);
      const { affectedRows } = result;
      if (!affectedRows) {
        res.sendStatus(404);
        logger.error(`id: ${id} not exists to update`);
        return;
      }
      connection.query(selectStmt, (err, result) => {
        logger.info(selectStmt, id);
        res.status(200).json(result);
        connection.release();
      });
    });
  });
};

const deleteTodo = (req, res, next) => {
  const { id } = req.body;
  if (!id) {
    logger.error(`id is not defined`);
    res.sendStatus(400);
    return;
  }
  const deleteStmt = mysql.format('DELETE FROM todos WHERE id = ?', [id]);
  pool.getConnection((err, connection) => {
    err && handleError(err);
    connection.query(deleteStmt, (err, result) => {
      const { affectedRows } = result;
      if (affectedRows) {
        res.sendStatus(200);
        logger.info(deleteStmt, id);
      } else {
        res.sendStatus(404);
        logger.error(`id: ${id} not exists to delete`);
      }
      connection.release();
    });
  });
};

module.exports = {
  retrieveTodo,
  createTodo,
  updateTodo,
  deleteTodo
};
