const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");

const app = express();
const PORT = process.env.PORT || 3000;
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
// Логгирование запросов и ответов
app.use(morgan("dev"));

// Подключение к MongoDB
mongoose
  .connect("адрес бд", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
    process.exit(1);
  });

// Определение схемы и модели для данных в MongoDB
const userSchema = new mongoose.Schema({
  title: String,
  text: String,
  createdAt: Date,
  updatedAt: Date,
  published: Boolean,
});

const Post = mongoose.model("Post", userSchema);

// Конфигурирование Express.js
app.use(express.json());

// Маршрутизация API
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    console.error("Error fetching users", err);
    res.status(500).json({ error: "An error occurred" });
  }
});
// Добавление записи
app.post("/api/posts", async (req, res) => {
  const { title, text, createdAt, updatedAt, published } = req.body;

  try {
    // Создаем нового пользователя
    const post = new Post({
      title,
      text,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      published: false,
    });
    // Начало транзакции
    const session = await mongoose.startSession();
    session.startTransaction();

    // Сохраняем пользователя в базе данных
    await post.save();
    // Завершение транзакции
    await session.commitTransaction();
    session.endSession();

    // Возвращаем успешный ответ
    res.status(201).json({ message: "Post created" });
  } catch (error) {
    // Обрабатываем ошибку и возвращаем ошибочный ответ
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Редактирование записи
app.put("/api/posts/:id", async (req, res) => {
  try {
    const updatedUser = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        text: req.body.text,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        published: req.body.published,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error("Error updating user", err);
    res.status(500).json({ error: "An error occurred" });
  }
});
app.delete("/api/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Post.deleteOne({ _id: id });
    res.status(204).send(); // No content
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});
// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
