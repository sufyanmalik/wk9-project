import { auth } from "@clerk/nextjs";
import { connect } from "@/utils/db";

export async function DELETE(req) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { postId } = await req.json();
    const db = connect();

    const { rowCount } = await db.query(
      "DELETE FROM posts WHERE id = $1 AND user_id = $2",
      [postId, userId]
    );

    if (rowCount === 0) {
      return new Response("Post not found or unauthorized", { status: 404 });
    }

    return new Response("Post deleted", { status: 200 });
  } catch (error) {
    console.error("Error deleting post:", error);
    return new Response("Server error", { status: 500 });
  }
}
