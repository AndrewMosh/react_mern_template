import React, { useEffect, useState } from "react";
import AddPastForm from "./AddPostForm";
import axios from "axios";

function Posts() {
  const [posts, setPosts] = useState([]);
  const [flag, setFlag] = useState(false);

  const handleDelete = (id) => {
    console.log(id);
    axios
      .delete(`http://localhost:3000/api/posts/${id}`)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
    setFlag(!flag);
  };

  const updatePublishedById = async (id) => {
    try {
      const updatedData = posts.map((item) => {
        if (item._id === id) {
          return {
            ...item,
            published: !item.published, // Toggle the published value
          };
        }
        return item;
      });

      const response = await axios.put(
        `http://localhost:3000/api/posts/${id}`,
        updatedData.find(({ _id }) => _id === id)
      );

      console.log("Data updated successfully");
      console.log(response.data); // Если вам нужно использовать данные ответа
    } catch (error) {
      console.error("Error updating data:", error);
    }
    setFlag(!flag);
  };

  useEffect(() => {
    fetch("http://localhost:3000/api/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error("Error fetching users", err));
    setFlag(false);
  }, [flag]);

  return (
    <div>
      <h1>Admin Panel</h1>
      <ul>
        {posts.map((user) => (
          <li key={user._id}>
            {user.title}-{user.text}{" "}
            <span onClick={() => handleDelete(user._id)}>&#10008;</span>{" "}
            <span onClick={() => updatePublishedById(user._id)}>
              {user.published ? "unpublish" : "publish"}
            </span>
          </li>
        ))}
      </ul>
      <AddPastForm setFlag={setFlag} />
    </div>
  );
}

export default Posts;
