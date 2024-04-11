const express = require('express');
const { Todo } = require('../mongo');
const { getAsync, setAsync } = require('../redis');

const router = express.Router();

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({});
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  try {
    const todo = await Todo.create({
      text: req.body.text,
      done: false,
    });
  
    if (todo) {
      let currentCount = await getAsync('added-todos');

      if (isNaN(currentCount) || !currentCount) {
        currentCount = 0;
      }

      const newCount = parseInt(currentCount) + 1;
      console.log(newCount);
      await setAsync('added-todos', newCount);
    }
  
    res.send(todo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add new todo: ', error});
  }
});

router.get('/statistics', async (req, res) => {
  const todoCount = await getAsync('added-todos');
  
  if (!todoCount) {
    res.status(404).json('Failed to load statistics');
  }

  res.status(200).json({ 'added-todos': todoCount });
})

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params;

  try {
    req.todo = await Todo.findById(id);
    if (!req.todo) return res.sendStatus(404);
  } catch (err) {
    console.log(
      'Failed to find todo by specified ID, something went wrong',
      err
    );
    res
      .status(500)
      .json('Failed to find todo by specified ID, something went wrong');
  }

  next();
};

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete();
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.send(req.todo);
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedTodo = await Todo.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedTodo) {
      return res.status(404).json('Failed to update todo');
    }

    res.status(200).json({
      updatedTodo,
      message: 'Todo updated successfully',
    });
  } catch (err) {
    console.error('Failed to update todo: ', err);
    res.status(500).json('Failed to update todo');
  }
});

router.use('/:id', findByIdMiddleware, singleRouter);

module.exports = router;
