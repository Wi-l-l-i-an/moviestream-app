
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("."));

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let db;

async function connectDB() {
  await client.connect();
  db = client.db("moviestream");
  console.log("Mongo conectado");
}

connectDB();

// CRUD Movies
// Listar
app.get("/movies", async (req, res) => {
  const { title } = req.query;

  let filter = {};
  if (title) {
    filter.title = { $regex: title, $options: "i" };
  }

  const movies = await db.collection("movies").find(filter).toArray();
  res.json(movies);
});
// Crear
app.post("/movies", async (req, res) => {
  const movie = req.body;

  // Ejemplo esperado:
  // { title, year, genres: [{name:"Action"}] }

  const result = await db.collection("movies").insertOne(movie);
  res.json(result);
});
// Editar
app.put("/movies/:id", async (req, res) => {
  const { id } = req.params;

  const result = await db.collection("movies").updateOne(
    { _id: new ObjectId(id) },
    { $set: req.body }
  );

  res.json(result);
});
// Eliminar
app.delete("/movies/:id", async (req, res) => {
  const { id } = req.params;

  const result = await db.collection("movies").deleteOne({
    _id: new ObjectId(id),
  });

  res.json(result);
});

// CRUD Users
// Listar
app.get("/users", async (req, res) => {
  const users = await db.collection("users").find().toArray();
  res.json(users);
});
// Crear
app.post("/users", async (req, res) => {
  const result = await db.collection("users").insertOne(req.body);
  res.json(result);
});
// Editar
app.put("/users/:id", async (req, res) => {
  const result = await db.collection("users").updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: req.body }
  );

  res.json(result);
});
// Eliminar
app.delete("/users/:id", async (req, res) => {
  const result = await db.collection("users").deleteOne({
    _id: new ObjectId(req.params.id),
  });

  res.json(result);
});

//Iniciar servidor
app.listen(3000, () => console.log("Servidor en puerto 3000"));