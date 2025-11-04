import React, { useState } from "react";
import { createPost } from "../api";

export default function PostForm({ onPostCreated }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await createPost({ title, content });
      setTitle("");
      setContent("");
      onPostCreated(); // notify parent to refresh
    } catch (err) {
      console.error(err);
      alert("Failed to create post");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add a New Post</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <br />
      <textarea
        placeholder="Content"
        value={content}
        onChange={e => setContent(e.target.value)}
        required
      />
      <br />
      <button type="submit">Submit</button>
    </form>
  );
}
