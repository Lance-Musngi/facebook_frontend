import React, { useState } from "react";
import { createPost } from "../api";

export default function PostForm() {
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [slowWarning, setSlowWarning] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSlowWarning(false);

    if (!author.trim() || !content.trim()) {
      setError("Author and content are required.");
      return;
    }

    try {
      setLoading(true);

      // Show warning if request takes longer than 10 seconds (less noisy for sleeping backends)
      const slowWarningTimer = setTimeout(() => {
        setSlowWarning(true);
      }, 10000);

      // Pass an explicit timeout (ms) to the API helper so long requests are aborted predictably.
      // Use 30s here to allow slow wake-ups but still fail eventually.
      await createPost(
        {
          author: author.trim(),
          content: content.trim(),
          imageUrl: imageUrl.trim() || null,
        },
        30000
      );

      clearTimeout(slowWarningTimer);

      // clear form
      setAuthor("");
      setContent("");
      setImageUrl("");
      setSlowWarning(false);

      // trigger reload for PostList
      console.log("Dispatching posts:updated event");
      window.dispatchEvent(new CustomEvent("posts:updated"));
    } catch (err) {
      console.error(err);
      setSlowWarning(false);
      // map timeout to a friendly message
      if (err.message === 'Request timed out') {
        setError("Server did not respond in time. It may be waking up — try again in a few seconds.");
      } else {
        setError(err.message || "Failed to create post.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="post-form card" onSubmit={handleSubmit}>
      <h2>Create post</h2>
      {error && <div className="error">{error}</div>}
      {slowWarning && (
        <div className="warning" style={{color: 'orange', margin: '10px 0'}}>
          ⏳ The server is taking longer than usual to respond. This might be because it's "waking up" from sleep mode.
        </div>
      )}

      <label>
        Author
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Your name"
        />
      </label>

      <label>
        What's on your mind?
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write something..."
        />
      </label>

      <label>
        Image URL (optional)
        <input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://..."
        />
      </label>

      <div className="actions">
        <button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}
