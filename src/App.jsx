import React, { useState } from "react";
import PostForm from "./components/PostForm";
import PostList from "./components/PostList";
import "./App.css";

export default function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePostCreated = () => setRefreshKey((k) => k + 1);

  return (
    <div className="app-container">
      <h1>Facebook API Demo</h1>
      <PostForm onPostCreated={handlePostCreated} />
      <PostList refreshKey={refreshKey} />
    </div>
  );
}
