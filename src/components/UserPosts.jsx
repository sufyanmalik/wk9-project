"use client";

import { useState } from "react";

export default function UserPosts({ initialPosts }) {
  const [posts, setPosts] = useState(initialPosts);

  const deletePost = async (postId) => {
    const response = await fetch(`/api/delete-post`, {
      method: "DELETE",
      body: JSON.stringify({ postId }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      setPosts(posts.filter((post) => post.id !== postId)); // Remove from UI
    } else {
      console.error("Failed to delete post");
    }
  };

  return (
    <div className="mt-4">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="border p-3 mb-3 rounded-lg shadow">
            <p className="text-gray-800">{post.content}</p>
            <button
              onClick={() => deletePost(post.id)}
              className="text-red-500 text-sm mt-2"
            >
              Delete
            </button>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No posts yet.</p>
      )}
    </div>
  );
}
