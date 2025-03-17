import { getAuth } from "@clerk/nextjs/server";
import { connect } from "@/utils/connect";

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const { content } = await req.json();
    console.log("Received content:", content);

    if (!content) {
      return new Response(JSON.stringify({ error: "Content is required" }), {
        status: 400,
      });
    }

    const db = connect();

    console.log(
      "Looking for user in user_account table with clerk_id:",
      userId
    );
    const userResult = await db.query(
      "SELECT id FROM user_account WHERE clerk_id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 400,
      });
    }

    const user_id = userResult.rows[0].id;
    console.log("User found with ID:", user_id);

    const result = await db.query(
      "INSERT INTO posts (user_id, content) VALUES ($1, $2) RETURNING *",
      [user_id, content]
    );

    return new Response(JSON.stringify(result.rows[0]), { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
