const todoController = require('./todo.ctrl');
const todoRouter = require('express').Router({});
const handleRequest = (req, res, next) => {
  res.end(req.method);
};


todoRouter.get('/', todoController.retrieveTodo);
todoRouter.post('/', todoController.createTodo);
todoRouter.put('/', todoController.updateTodo);
todoRouter.delete('/', handleRequest);

module.exports = todoRouter;
