// Default API base: prefer Vite env var, otherwise use your Render URL fallback
const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://facebookapi-1-k6yt.onrender.com/api/posts";

// Helper: fetch with timeout using AbortController. Default timeout 15s.
async function fetchWithTimeout(url, options = {}, timeout = 15000) {
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
  const res = await fetchWithTimeout(API_BASE, {}, timeout);
  if (!res.ok) throw new Error('Failed to load posts');
  return await res.json();
}

export async function createPost(post, timeout) {
  const res = await fetchWithTimeout(
    API_BASE,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    },
    timeout
  );
  if (!res.ok) throw new Error('Failed to create post');
  return await res.json();
}

export async function deletePost(id, timeout) {
  const res = await fetchWithTimeout(`${API_BASE}/${id}`, { method: 'DELETE' }, timeout);
  if (!res.ok) throw new Error('Failed to delete post');
}

export async function updatePost(id, post, timeout) {
  const res = await fetchWithTimeout(
    `${API_BASE}/${id}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    },
    timeout
  );
  if (!res.ok) throw new Error('Failed to update post');
  return await res.json();
}
