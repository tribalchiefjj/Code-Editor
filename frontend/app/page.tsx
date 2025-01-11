import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <h1>Welcome to the Real-Time Code Editor</h1>
      <Link href="/editor">Go to Editor</Link>
    </main>
  );
}
