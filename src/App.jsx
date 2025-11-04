import { useEffect, useState } from "react";
import { getPosts } from "./api";
import PostForm from "./components/PostForm";
import PostList from "./components/PostList";
import "./App.css";

export default function App() {
  const [posts, setPosts] = useState([]);

  const loadPosts = async () => {
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (error) {
      console.error("Error loading posts:", error);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <div className="container">
      <PostForm onPostCreated={loadPosts} />
      <PostList posts={posts} />
    </div>
  );
}
