import React, { useState } from "react";

function PostItem({ post, onEdit, onDelete }) {
  return (
    <article className="post card">
      <header className="post-header">
        <div>
          <strong>{post.author}</strong>
          <div className="meta">
            {new Date(post.createdAt).toLocaleString()}
          </div>
        </div>
        <div className="controls">
          <button onClick={() => onEdit(post)}>Edit</button>
          <button onClick={() => onDelete(post.id)}>Delete</button>
        </div>
      </header>

      <div className="post-body">
        <p>{post.content}</p>
        {post.imageUrl && (
          <div className="post-image">
            <img
              src={post.imageUrl}
              alt="post"
              onError={(e) => (e.target.style.display = "none")}
            />
          </div>
        )}
      </div>

      {post.modifiedAt && post.modifiedAt !== post.createdAt && (
        <div className="modified">
          Modified: {new Date(post.modifiedAt).toLocaleString()}
        </div>
      )}
    </article>
  );
}

function EditModal({ post, onCancel, onSave }) {
  const [author, setAuthor] = useState(post.author);
  const [content, setContent] = useState(post.content);
  const [imageUrl, setImageUrl] = useState(post.imageUrl || "");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    await onSave({ ...post, author, content, imageUrl: imageUrl || null });
    setSaving(false);
  }

  return (
    <div className="modal-backdrop">
      <form className="modal card" onSubmit={handleSubmit}>
        <h3>Edit post</h3>

        <label>
          Author
          <input value={author} onChange={(e) => setAuthor(e.target.value)} />
        </label>

        <label>
          Content
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </label>

        <label>
          Image URL
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </label>

        <div className="actions">
          <button type="button" onClick={onCancel} disabled={saving}>
            Cancel
          </button>
          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function PostList({ posts = [], loading, error, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(null);

  async function handleDelete(id) {
    if (!confirm("Delete this post?")) return;
    onDelete(id);
  }

  async function handleSave(updatedPost) {
    await onUpdate(updatedPost); 
    setEditing(null); 
  }

  return (
    <section className="post-list">
      <h2>Recent posts</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="error">{error}</div>}
      {!loading && posts.length === 0 && <div>No posts yet!</div>}

      {posts.map((p) => (
        <PostItem 
          key={p.id} 
          post={p} 
          onEdit={setEditing} 
          onDelete={handleDelete} 
        />
      ))}

      {editing && (
        <EditModal
          post={editing}
          onCancel={() => setEditing(null)}
          onSave={handleSave}
        />
      )}
    </section>
  );
}