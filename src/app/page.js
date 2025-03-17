"use server";

import { connect } from "@/utils/connect";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import UserForm from "@/components/UserForm";

export default async function ProfilePage() {
  const { userId } = await auth();
  if (!userId) return redirect("/sign-in");

  const db = connect();

  try {
    const { rows, rowCount } = await db.query(
      "SELECT * FROM user_account WHERE clerk_id = $1",
      [userId]
    );

    if (rowCount === 0) {
      return (
        <div>
          <h1>Complete Your Profile</h1>
          <UserForm />
        </div>
      );
    }

    return (
      <div>
        <h1>Welcome, {rows[0].username}!</h1>
      </div>
    );
  } catch (error) {
    console.error("Error fetching user data:", error);
    return <div>Error fetching user data. Please try again later.</div>;
  }
}
