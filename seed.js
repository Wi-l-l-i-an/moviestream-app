

const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://willianlemus050506_db_user:L83gGB6XZuEYZZpp@willscluster.duhzwgx.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

async function seed() {
  await client.connect();
  const db = client.db("moviestream");

  await db.collection("users").deleteMany({});
  await db.collection("movies").deleteMany({});
  await db.collection("genres").deleteMany({});

  // Géneros
  const genres = [
    { genre_id: 1, name: "Action" },
    { genre_id: 2, name: "Comedy" },
    { genre_id: 3, name: "Drama" },
    { genre_id: 4, name: "Sci-Fi" },
    { genre_id: 5, name: "Horror" }
  ];

  await db.collection("genres").insertMany(genres);

  // Películas
  let movies = [];
  for (let i = 1; i <= 20; i++) {
    movies.push({
      movie_id: i,
      title: "Movie " + i,
      year: 2000 + i,
      genres: [genres[i % 5]],
      cast: ["Actor A", "Actor B"],
      price: 100 + i,
      views: Math.floor(Math.random() * 1000)
    });
  }

  await db.collection("movies").insertMany(movies);

  // Usuarios
  let users = [];
  for (let i = 1; i <= 15; i++) {
    users.push({
      cust_id: i,
      name: {
        first: "User",
        last: i
      },
      email: `user${i}@mail.com`,
      demographics: {
        age: 20 + i,
        gender: i % 2 === 0 ? "M" : "F"
      },
      watchHistory: [
        {
          movie_id: Math.ceil(Math.random() * 20),
          date: new Date(),
          rating: Math.ceil(Math.random() * 5),
          device: "Mobile",
          price: 120
        }
      ]
    });
  }

  await db.collection("users").insertMany(users);

  console.log("✅ Base de datos creada correctamente");
  await client.close();
}

seed();