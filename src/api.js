const API_URL = "https://facebookapi-u5ih.onrender.com/api/posts";

export async function getPosts() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Failed to fetch posts");
  return response.json();
}

export async function createPost(post) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  });
  if (!response.ok) throw new Error("Failed to create post");
  return response.json();
}
