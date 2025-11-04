import React, { useEffect, useState } from "react";
import { getPosts } from "../api";

export default function PostList({ refreshKey }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts().then(setPosts);
  }, [refreshKey]);

  return (
    <div>
      <h2>All Posts</h2>
      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <ul>
          {posts.map((p) => (
            <li key={p.id}>
              <strong>{p.title}</strong>: {p.content}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
