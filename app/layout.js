import "./globals.css";

export const metadata = {
  title: "EtharaAI | Project Tracker",
  description: "Advanced project and task management with role-based access."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
