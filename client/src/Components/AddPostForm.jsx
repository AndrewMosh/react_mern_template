import React, { useState } from "react";

function AddPostForm({ setFlag }) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  // Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();

    // Создание объекта с данными пользователя
    const newPost = {
      title: title,
      text: text,
    };

    // Отправка данных на сервер
    fetch("http://localhost:3000/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPost),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Post added successfully");
        // Обновление списка пользователей или выполнение других действий
      })
      .catch((err) => console.error("Error adding post", err));

    // Очистка полей формы
    setTitle("");
    setText("");
    setFlag(true);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <br />
      <label>
        Text:
        <textarea
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </label>
      <br />
      <button type="submit">Add Post</button>
    </form>
  );
}

export default AddPostForm;
