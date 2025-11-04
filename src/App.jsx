import React, { useState } from "react";
import PostForm from "./components/PostForm";
import PostList from "./components/PostList";
import "./App.css";

export default function App() {
  const [refresh, setRefresh] = useState(false);

  const handlePostCreated = () => setRefresh(!refresh);

  return (
    <div className="app-container">
      <h1>Facebook API Demo</h1>
      <PostForm onPostCreated={handlePostCreated} />
      <PostList key={refresh} />
    </div>
  );
}
