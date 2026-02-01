import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Thanaphat Chirutpadathorn",
  description: "Thoughts on software development, technology, and building products.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
