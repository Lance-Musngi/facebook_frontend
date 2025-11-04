const API_BASE = "https://facebookapi-u5ih.onrender.com/api";

export async function getPosts() {
  try {
    const res = await fetch(`${API_BASE}/posts`);
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    return res.json();
  } catch (err) {
    console.error("❌ Error fetching posts:", err);
    return [];
  }
}

export async function createPost(post) {
  try {
    const res = await fetch(`${API_BASE}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`POST failed (${res.status}): ${text}`);
    }
    return res.json();
  } catch (err) {
    console.error("❌ Error creating post:", err);
    throw err;
  }
}
