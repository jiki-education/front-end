import { ServerAuthGuard } from "../../components/layout/auth/external/ServerAuthGuard";

export default function ExternalLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ServerAuthGuard>{children}</ServerAuthGuard>;
}
