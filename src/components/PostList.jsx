import React from 'react';

function formatDate(d) {
  if (!d) return '';
  const dt = new Date(d);
  return dt.toLocaleString();
}

export default function PostList({ posts = [], onEdit, onDelete }) {
  if (!posts.length) {
    return <div className="card small-muted">No posts yet.</div>;
  }

  return (
    <>
      {posts.map(post => (
        <div className="card" key={post.id}>
          <div className="post-meta">
            <div>
              <div className="post-author">{post.author}</div>
              <div className="post-dates">
                created: {formatDate(post.createdAt)} · modified: {formatDate(post.modifiedAt)}
              </div>
            </div>
          </div>

          <div className="post-content">{post.content}</div>

          {post.imageUrl && (
            // eslint-disable-next-line jsx-a11y/alt-text
            <img src={post.imageUrl} className="post-image" />
          )}

          <div className="controls">
            <button className="btn btn-primary" onClick={() => onEdit && onEdit(post)}>Edit</button>
            <button className="btn btn-ghost" onClick={() => onDelete && onDelete(post.id)}>Delete</button>
          </div>
        </div>
      ))}
    </>
  );
}