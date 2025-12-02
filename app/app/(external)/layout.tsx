import { AuthGuard } from "./AuthGuard";

export default function ExternalLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AuthGuard>{children}</AuthGuard>;
}
