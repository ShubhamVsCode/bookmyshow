import { PhoneCallIcon } from "lucide-react";

export default function Home() {
  return (
    <main className="flex flex-col flex-1 justify-center items-center bg-[url('/images/background.jpeg')] bg-center bg-gray-900">
      <h1 className="text-3xl flex items-center gap-4">
        <PhoneCallIcon />
        Scalable Chat App
      </h1>
    </main>
  );
}
