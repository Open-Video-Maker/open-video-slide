import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>OVM Services Center</h1>
      <ul>
        <li>
          <Link href="/examples/text-to-speech">Text to Speech</Link>
        </li>
      </ul>
    </main>
  );
}
