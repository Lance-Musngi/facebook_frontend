export default function PostList({ posts }) {
  return (
    <div className="posts">
      <h2>All Posts</h2>
      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="post">
            <h3>{post.author}</h3>
            <p>{post.content}</p>
          </div>
        ))
      )}
    </div>
  );
}
