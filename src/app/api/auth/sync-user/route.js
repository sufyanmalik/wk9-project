import { getAuth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    console.log("Received userId:", userId);

    const { data: existingUser, error } = await supabase
      .from("user_account")
      .select("*")
      .eq("clerk_id", userId)
      .single();

    if (error) {
      console.error("Supabase error fetching user:", error);
    }

    if (!existingUser) {
      console.log("User does not exist, creating user...");

      const clerkUser = await fetch(
        `https://api.clerk.dev/v1/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}` },
        }
      ).then((res) => res.json());

      if (!clerkUser) {
        console.error("Failed to fetch user from Clerk");
        return new Response(
          JSON.stringify({ error: "Failed to fetch user from Clerk" }),
          { status: 500 }
        );
      }

      console.log("Fetched user from Clerk:", clerkUser);

      const { error: insertError } = await supabase
        .from("user_account")
        .insert([{ clerk_id: userId, username: clerkUser.username }]);

      if (insertError) {
        console.error("Error inserting user into Supabase:", insertError);
        return new Response(
          JSON.stringify({ error: "Failed to create user" }),
          { status: 500 }
        );
      }

      console.log("User created successfully in Supabase");
    } else {
      console.log("User already exists in Supabase");
    }

    return new Response(JSON.stringify({ message: "User synced" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error syncing user:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
