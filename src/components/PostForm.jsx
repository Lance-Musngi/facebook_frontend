import { useState } from "react";
import { createPost } from "../api";

export default function PostForm({ onPostCreated }) {
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPost({ author, content });
      alert("Post created successfully!");
      setAuthor("");
      setContent("");
      onPostCreated();
    } catch (error) {
      alert("Failed to create post");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Add a New Post</h2>
      <input
        type="text"
        placeholder="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        required
      />
      <textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
}
