import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen  items-center justify-center">
      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/" });
        }}
      >
        <button
          type="submit"
          className="rounded-md border px-4 py-2 text-sm font-medium"
        >
          Continue with Google
        </button>
      </form>
    </main>
  );
}
