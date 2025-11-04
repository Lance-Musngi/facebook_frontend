import React, { useState } from "react";

export default function PostForm({ 
  initial = {}, 
  onSubmit, 
  onCancel, 
  submitLabel = 'Post'
}) {
  const [author, setAuthor] = useState(initial.author || "");
  const [content, setContent] = useState(initial.content || "");
  const [imageUrl, setImageUrl] = useState(initial.imageUrl || "");
  const [busy, setBusy] = useState(false); 
  const [error, setError] = useState(null);
  const [slowWarning, setSlowWarning] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSlowWarning(false);
    let slowWarningTimer;

    if (!author.trim() || !content.trim()) {
      setError("Author and content are required.");
      return;
    }

    try {
      setBusy(true);

      slowWarningTimer = setTimeout(() => {
        setSlowWarning(true);
      }, 10000);

      await onSubmit(
        {
          author: author.trim(),
          content: content.trim(),
          imageUrl: imageUrl.trim() || null,
        },
        30000
      );

      clearTimeout(slowWarningTimer);

      if (!initial.id) {
        setAuthor("");
        setContent("");
        setImageUrl("");
      }
      setSlowWarning(false);

    } catch (err) {
      console.error(err);
      clearTimeout(slowWarningTimer);
      setSlowWarning(false);

      if (err.message === 'Request timed out') {
        setError("Server did not respond in time. It may be waking up — try again in a few seconds.");
      } else {
        setError(err.message || "Failed to create post.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="post-form card" onSubmit={handleSubmit}>
      <h2>{initial.id ? 'Edit Post' : 'Create post'}</h2>
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
        <button type="submit" disabled={busy}>
          {busy ? "Posting..." : submitLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-ghost">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}