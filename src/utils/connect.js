import pg from "pg";

// Initialize the connection pool once and reuse it
let db;

export function connect() {
  // Create the pool only once, then reuse it
  if (!db) {
    db = new pg.Pool({
      connectionString: process.env.DB_CONN, // Ensure you have your DB_CONN in the environment variables
    });
  }

  return db;
}
