"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import ProfileUpdateForm from "@/components/ProfileUpdateForm";
import UserPosts from "@/components/UserPosts";
import UserForm from "@/components/UserForm";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!user) return;
      const response = await fetch(`/api/user-posts?userId=${user.id}`);
      if (response.status === 401) {
        window.location.href = "/sign-in";
        return;
      }
      const posts = await response.json();
      setUserPosts(posts);
    };

    if (isLoaded) {
      fetchUserPosts();
    }
  }, [user, isLoaded]);

  if (!isLoaded) return <p>Loading...</p>;

  // Function to add new post to UI
  const handlePostCreated = (newPost) => {
    setUserPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">
        Welcome, {user?.username || "User"}
      </h1>
      <ProfileUpdateForm /> {/* Profile Update Form */}
      <UserForm onPostCreated={handlePostCreated} /> {/* Post Creation Form */}
      <section className="mt-6">
        <h2 className="text-xl font-semibold">Your Posts</h2>
        {userPosts.length > 0 ? (
          <UserPosts initialPosts={userPosts} />
        ) : (
          <p className="text-gray-500">No posts yet.</p>
        )}
      </section>
    </div>
  );
}
