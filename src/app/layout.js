
import "./globals.css";

export const metadata = {
  title: "Kane Jackson",
  description: "Welcome to my little corner of the internet <3",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
