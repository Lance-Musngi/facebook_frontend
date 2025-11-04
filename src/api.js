// api.js
// 🚨 UPDATE: Use your new deployed backend URL
const API_BASE = "https://facebookapi-5vm5.onrender.com/api"; 

// UPDATED: Long timeout (120 seconds) to account for Render cold starts
async function fetchWithTimeout(url, options = {}, timeout = 120000) { 
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('Request timed out');
    throw err;
  } finally {
    clearTimeout(id);
  }
}

export async function getPosts(timeout) {
  const res = await fetchWithTimeout(`${API_BASE}/posts`, {}, timeout);
  if (!res.ok) throw new Error('Failed to load posts');
  return await res.json();
}

export async function createPost(post, timeout) {
  const res = await fetchWithTimeout(
    `${API_BASE}/posts`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    },
    timeout
  );
  if (!res.ok) {
    // Captures the specific error text from the server (e.g., validation message)
    const errorText = await res.text();
    throw new Error(errorText || 'Failed to create post');
  }
  return await res.json();
}

export async function deletePost(id, timeout) {
  const res = await fetchWithTimeout(`${API_BASE}/posts/${id}`, { method: 'DELETE' }, timeout);
  if (!res.ok) throw new Error('Failed to delete post');
}

export async function updatePost(id, post, timeout) {
  const res = await fetchWithTimeout(
    `${API_BASE}/posts/${id}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    },
    timeout
  );
  if (!res.ok) {
    // Captures the specific error text from the server (e.g., validation message)
    const errorText = await res.text();
    throw new Error(errorText || 'Failed to update post');
  }
  return await res.json();
}