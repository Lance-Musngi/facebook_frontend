// src/api.js
// Handles API calls and base URL for backend

// Prefer environment variable so the deployed frontend points to the correct backend.
// Works for both Vite and Create React App.
const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE) ||
  process.env.REACT_APP_API_BASE ||
  "https://facebookapi-5vm5.onrender.com/api"; // fallback (local dev or default)

// Helper: timeout wrapper
async function fetchWithTimeout(url, options = {}, timeout = 120000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

// ------------------- API CALLS -------------------

// ✅ GET all posts
export async function getPosts(timeout = 120000) {
  const res = await fetchWithTimeout(`${API_BASE}/posts`, {}, timeout);
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

// ✅ CREATE new post
export async function createPost(postData, timeout = 120000) {
  const res = await fetchWithTimeout(`${API_BASE}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
  }, timeout);
  if (!res.ok) throw new Error("Failed to create post");
  return res.json();
}

// ✅ UPDATE existing post
export async function updatePost(id, updatedPost, timeout = 120000) {
  const res = await fetchWithTimeout(`${API_BASE}/posts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedPost),
  }, timeout);
  if (!res.ok) throw new Error("Failed to update post");
  return res.json();
}

// ✅ DELETE post
export async function deletePost(id, timeout = 120000) {
  const res = await fetchWithTimeout(`${API_BASE}/posts/${id}`, {
    method: "DELETE",
  }, timeout);
  if (!res.ok) throw new Error("Failed to delete post");
  return res;
}
