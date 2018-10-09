const mysql = require('mysql');
const { STATUS_CODE } = require('../constants');
const { host, user, port, database, timezone } = process.env;
const connectionInfo = {
  host, user, port, database, timezone, connectionLimit: 5, acquireTimeout: 2000
};
const pool = mysql.createPool(connectionInfo);


const handleConnectionError = (err, next) => {
  next(err);
};

const handleSQLError = (err, connection, next) => {
  next(err);
  connection.release();
};

const retrieveTodo = (req, res, next) => {
  const selectSQL = 'SELECT * FROM todos';
  pool.getConnection((err, connection) => {
    if (err) {
      handleConnectionError(err, next);
      return;
    }
    connection.query(selectSQL, (err, rows, fields) => {

      if (err) {
        handleSQLError(err, connection, next);
        return;
      }

      res.status(STATUS_CODE.SUCCESS).json(rows);
      connection.release();
    });
  });
};

const createTodo = (req, res, next) => {
  const { task } = req.body;
  const insertSQL = 'INSERT INTO todos (task) VALUES (?)';
  const selectSQL = 'SELECT * FROM todos WHERE id = ?';
  pool.getConnection((err, connection) => {
    if (err) {
      handleConnectionError(err, next);
      return;
    }
    const insertStmt = mysql.format(insertSQL, [task]);
    connection.query(insertStmt, (err, results) => {
      if (err) {
        handleSQLError(err, connection, next);
        return;
      }
      const { insertId } = results;
      const selectStmt = mysql.format(selectSQL, [insertId]);
      connection.query(selectStmt, (err, result, fields) => {
        if (err) {
          handleSQLError(err, connection, next);
          return;
        }
        res.status(STATUS_CODE.SUCCESS).json(result);
        connection.release();
      });
    });
  });
};

const updateTodo = (req, res, next) => {
  const { id, ...data } = req.body;
  const setValue = Object.keys(data).map(key => `${key} = '${data[key]}'`);
  const updateSQL = toSet => `UPDATE todos SET ${toSet} WHERE id = ?`;
  const selectSQL = 'SELECT * FROM todos WHERE id = ?';
  const updateStmt = mysql.format(updateSQL(setValue), [id]);
  console.log(updateStmt);
  const selectStmt = mysql.format(selectSQL, [id]);
  pool.getConnection((err, connection) => {
    if (err) {
      handleConnectionError(err, next);
      return;
    }
    connection.query(updateStmt, (err, results) => {
      if (err) {
        handleSQLError(err, connection, next);
        return;
      }
      connection.query(selectStmt, (err, result, fields) => {
        if (err) {
          handleSQLError(err, connection, next);
          return;
        }
        res.status(STATUS_CODE.SUCCESS).json(result);
        connection.release();
      });
    });
  });
};

const deleteTodo = (req, res, next) => {
  const { id } = req.body;
  const deleteSQL = 'DELETE FROM todos WHERE id = ?';
  const deleteStmt = mysql.format(deleteSQL, [id]);
  pool.getConnection((err, connection) => {
    if (err) {
      handleConnectionError(err, next);
      return;
    }
    connection.query(deleteStmt, (err, results) => {
      if (err) {
        handleSQLError(err, connection, next);
        return;
      }
      connection.query(selectStmt, (err, result, fields) => {
        if (err) {
          handleSQLError(err, connection, next);
          return;
        }
        res.status(STATUS_CODE.SUCCESS).json(result);
        connection.release();
      });
    });
  });
};

module.exports = {
  createTodo,
  retrieveTodo,
  updateTodo,
  deleteTodo
};
