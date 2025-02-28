const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const app = express();
const port = 9000;

const sequelize = new Sequelize("todos_db", "postgres", "postgres", {
  host: "localhost",
  dialect: "postgres",
  logging: false,
});

const Todo = sequelize.define("Todo", {
  task: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

sequelize
  .sync({ force: false, alter: true, logging: true })
  .then(() => {
    console.log("Database synced successfully");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

app.use(express.json());

app.get("/todos", async (req, res) => {
  const todos = await Todo.findAll();
  res.json(todos);
});

app.post("/todos", async (req, res) => {
  const { task } = req.body;
  if (!task) {
    res.status(400).json({ error: "Task is required" });
  }

  const todo = await Todo.create({ task });
  res.json(todo);
});
app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { task, completed } = req.body;
  const todo = await Todo.findByPk(id);

  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }

  if (todo) {
    todo.task = task;
  }
  if (completed !== undefined) {
    todo.completed = completed;
  }
  await todo.save();
  res.json(todo);
});

app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  await Todo.destroy({ where: { id } });
  const todos = await Todo.findAll();
  res.json(todos);
});
app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`)
);
