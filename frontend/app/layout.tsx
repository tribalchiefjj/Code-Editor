import './globals.css';

export const metadata = {
  title: 'Real-Time Code Editor',
  description: 'A collaborative code editing platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
