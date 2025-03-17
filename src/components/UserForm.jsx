"use client";

import { useState } from "react";

export default function UserForm({ onPostCreated }) {
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const response = await fetch("/api/create-post", {
      method: "POST",
      body: JSON.stringify({ content }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      const newPost = await response.json();
      onPostCreated(newPost);
      setContent("");
    } else {
      alert("Failed to create post.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write something..."
        className="w-full p-2 border rounded-md"
      ></textarea>
      <button
        type="submit"
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Post
      </button>
    </form>
  );
}
