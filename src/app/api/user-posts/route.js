import { getAuth } from "@clerk/nextjs/server";
import { connect } from "@/utils/connect";

export async function GET(req) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const db = connect();
    const result = await db.query(
      "SELECT * FROM posts WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );

    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) return new Response("Unauthorized", { status: 401 });

    const { content } = await req.json();
    if (!content || content.trim() === "") {
      return new Response("Content is required", { status: 400 });
    }

    const db = connect();
    await db.query("INSERT INTO posts (user_id, content) VALUES ($1, $2)", [
      userId, // userId is now INT, directly use it
      content,
    ]);

    return new Response("Post created successfully", { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
