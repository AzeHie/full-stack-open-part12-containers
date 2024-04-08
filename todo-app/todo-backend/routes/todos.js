const express = require('express');
const { Todo } = require('../mongo');
const router = express.Router();

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({});
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false,
  });
  res.send(todo);
});

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
    const id = req.params;
    const updatedTodo = await Todo.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedTodo) {
      return res.status(404).json('Failed to update todo');
    }
  } catch (err) {
    console.error('Failed to update todo: ', err);
    res.status(500).json('Failed to update todo');
  }
});

router.use('/:id', findByIdMiddleware, singleRouter);

module.exports = router;
