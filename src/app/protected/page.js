import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function ProtectedPage() {
  return (
    <div>
      <SignedOut>
        <p>You need to be signed in to view this page.</p>
      </SignedOut>

      <SignedIn>
        <p>Welcome to the protected page!</p>
      </SignedIn>
    </div>
  );
}
