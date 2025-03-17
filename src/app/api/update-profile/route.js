import { auth } from "@clerk/nextjs/server";
import { connect } from "@/utils/connect";

export async function PUT(req) {
  try {
    const { userId } = await auth();
    if (!userId) return new Response("Unauthorized", { status: 401 });

    const { username } = await req.json();
    if (!username || username.trim() === "") {
      return new Response("Username is required", { status: 400 });
    }

    const cleanUserId = parseInt(userId.replace(/^user_/, ""), 10);

    if (isNaN(cleanUserId)) {
      return new Response("Invalid user ID format", { status: 400 });
    }

    const db = connect();
    await db.query("UPDATE user_account SET username = $1 WHERE id = $2", [
      username,
      cleanUserId,
    ]);

    console.log("Received userId:", cleanUserId);
    console.log("Received username:", username);

    return new Response("Profile updated successfully", { status: 200 });
  } catch (error) {
    console.error("Error updating profile:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
