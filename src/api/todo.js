const todoController = require('./todo.ctrl');
const todoRouter = require('express').Router({});

todoRouter.get('/', todoController.retrieveTodo);
todoRouter.post('/', todoController.createTodo);
todoRouter.put('/', todoController.updateTodo);
todoRouter.delete('/', todoController.deleteTodo);

module.exports = todoRouter;
