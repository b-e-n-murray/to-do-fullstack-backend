import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import client from "./db";
// import filePath from "./filePath";

const app = express();
/** Parses JSON data in a request automatically */
app.use(express.json());
/** To allow 'Cross-Origin Resource Sharing': https://en.wikipedia.org/wiki/Cross-origin_resource_sharing */
app.use(cors());
// read in contents of any environment variables in the .env file
dotenv.config();
// use the environment variable PORT, or 4000 as a fallback
const PORT_NUMBER = process.env.PORT ?? 4000;
client.connect()

app.get("/todos", async (req, res) => {
  console.log('Requesting all todos...')
  const allToDos = await client.query('SELECT * FROM todo_list')
  console.log(allToDos)
  res.json(allToDos.rows)
});

// POST /items
app.post("/todos", async (req, res) => {
  const todoBody = req.body;
  console.log('Inserting ', todoBody, ' into db')
  const postedToDo = await client.query('INSERT INTO todo_list (body) VALUES($1) RETURNING *', [todoBody])
  res.status(201).json(postedToDo.rows[0]);
});

// GET /items/:id
app.get("/todos/:id", async (req, res) => {
  const id = req.params.id
  console.log('retrieving todo of id: ', id)
  const selectedID = await client.query('SELECT * FROM todo_list WHERE id = ($1)', [id])
  res.status(200).json(selectedID.rows[0]);
  });

// DELETE /items/:id
app.delete("/todos/:id", async (req, res) => {
    const id = req.params.id
    const todoForDeletion = await client.query('DELETE FROM todo_list WHERE id = ($1)', [id])
    res.status(200).json(todoForDeletion);
  });

// PATCH /items/:id
app.patch("/todos/:id", async (req, res) => {
  const id = req.params.id;
  const newBody = req.body;
  const updatedTodo = await client.query('UPDATE todo_list SET body = $1 WHERE id = $2',
   [newBody, id]
   );
    res.status(200).json(updatedTodo.rows[0]);
  });

app.listen(PORT_NUMBER, () => {
  console.log(`Server is listening on port ${PORT_NUMBER}!`);
});
