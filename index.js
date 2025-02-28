const express = require("express");
const app = express();
const port = 3000;

let todos = [];
app.use(express.json());

app.get("/todos", (req, res) => {
  res.json(todos);
});

app.post("/todos", (req, res) => {
  // console.log("POST request received:", req.body);  // Debugging log
  const { task } = req.body;
  if (!task) {
    res.status(400).json({ error: "Task is required" });
  }

  const newTodo = { id: todos.length + 1, task, completed: "false" };
  todos.push(newTodo);
  res.json(newTodo);
});
app.put("/todos/:id", (req, res) => {
  const { id } = req.params;
  const { task, completed } = req.body; // Destructure both 'task' and 'completed' from the request body
  const todo = todos.find((t) => t.id == id);

  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }

  // Only update the task if it exists in the request body
  if (task) {
    todo.task = task;
  }

  // Only update the completed status if it exists in the request body
  if (completed !== undefined) {
    todo.completed = completed;
  }

  res.json(todo); // Return the updated todo
});

app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;
  todos = todos.filter((t) => t.id != id);
  res.json(todos);
});
app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`)
);
