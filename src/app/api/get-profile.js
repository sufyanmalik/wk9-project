import { getAuth } from "@clerk/nextjs/server";
import { connect } from "../../utils/connect";

export default async function handler(req, res) {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const db = connect();
    const result = await db.query(
      "SELECT username FROM user_account WHERE clerk_id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Fetch profile error:", error);
    return res.status(500).json({ error: "Database query failed" });
  }
}
