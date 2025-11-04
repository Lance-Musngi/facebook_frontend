import React, { useEffect, useState } from "react";
import PostForm from "./components/PostForm";
import PostList from "./components/PostList";
import { getPosts, deletePost, createPost, updatePost } from "./api";
import "./App.css";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadPosts() {
    setLoading(true);
    setError(null);
    try {
      const data = await getPosts();
      const sorted = data.sort((a, b) => b.id - a.id); 
      setPosts(sorted);
    } catch (err) {
      console.error("Failed to load posts", err);
      setError(err.message || "Failed to load posts.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
    const handlePostsUpdated = () => {
      loadPosts();
    };
    window.addEventListener("posts:updated", handlePostsUpdated);
    return () => window.removeEventListener("posts:updated", handlePostsUpdated);
  }, []);

  async function handleCreate(postData, timeout) {
    try {
      const newPost = await createPost(postData, timeout);
      setPosts(prev => [newPost, ...prev]); 
    } catch (err) {
      throw err;
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this post?")) return;
    try {
      await deletePost(id);
      setPosts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert("Failed to delete: " + err.message);
    }
  }

  function handleEdit(post) {
    setEditing(post);
  }

  async function handleUpdate(updatedPost) {
    try {
      const result = await updatePost(updatedPost.id, updatedPost);
      setPosts(prev => prev.map(p => p.id === result.id ? result : p));
      setEditing(null); 
    } catch (err) {
      alert("Failed to update post: " + err.message);
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Facebook-like Posts</h1>
      </header>

      <main className="app-main">
        <div className="post-form-wrapper">
          <PostForm onSubmit={handleCreate} submitLabel="Post" />
        </div>
        
        {error && <div className="error">{error}</div>}

        <section className="post-list">
          <PostList 
            posts={posts} 
            loading={loading} 
            error={null} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
            onUpdate={handleUpdate} 
          />
        </section>
      </main>

      <footer className="app-footer">
        <p>
          built with ❤️ — <strong>facebook-posts-ui</strong>
        </p>
      </footer>

      {editing && (
        <div className="modal-backdrop">
          <div className="modal card">
            <h3>Edit post</h3>
            <PostForm
              initial={editing}
              onSubmit={handleUpdate}
              onCancel={() => setEditing(null)}
              submitLabel="Save"
            />
          </div>
        </div>
      )}
    </div>
  );
}