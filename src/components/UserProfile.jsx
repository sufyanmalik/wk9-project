"use client";

import { useState, useEffect } from "react";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch("/api/get-profile");
        const data = await response.json();
        if (response.ok) {
          setUser(data);
        } else {
          console.error("Error fetching profile:", data.error);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div>
      <h2>Welcome, {user.username}!</h2>
    </div>
  );
}
