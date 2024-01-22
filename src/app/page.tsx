import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-5xl mb-5">Catch Show</h1>

      <Link href={"/booking"}>
        <Button>Admin Panel</Button>
      </Link>
    </main>
  );
}
