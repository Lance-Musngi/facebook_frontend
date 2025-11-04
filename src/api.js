import { useEffect, useState } from "react";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });

  const API_URL = "https://facebookapi-u5ih.onrender.com/api/posts";

  // Fetch posts
  const fetchPosts = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });

      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }

      alert("Post created successfully!");
      setNewPost({ title: "", content: "" });
      fetchPosts();
    } catch (error) {
      console.error("Failed to create post:", error);
      alert("Failed to create post");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h2>Add a New Post</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          required
          style={{ display: "block", width: "100%", marginBottom: "1rem" }}
        />
        <textarea
          placeholder="Content"
          value={newPost.content}
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          required
          style={{ display: "block", width: "100%", marginBottom: "1rem" }}
        />
        <button type="submit">Submit</button>
      </form>

      <h3>All Posts</h3>
      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <b>{post.title}</b>: {post.content}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
