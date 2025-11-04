import React, { useEffect, useState } from "react";
import { getPosts } from "../api";

export default function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts()
      .then(data => setPosts(data))
      .catch(err => console.error("Error fetching posts:", err));
  }, []);

  return (
    <div>
      <h2>All Posts</h2>
      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <ul>
          {posts.map(post => (
            <li key={post.id}>
              <strong>{post.title}</strong> — {post.content}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
