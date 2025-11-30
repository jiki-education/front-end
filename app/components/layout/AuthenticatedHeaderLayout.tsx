import Footer from "./footer";
import Header from "./header/internal";

interface AuthenticatedHeaderLayoutProps {
  children: React.ReactNode;
}

export default function AuthenticatedHeaderLayout({ children }: AuthenticatedHeaderLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 mt-[70px]">{children}</main>
      <Footer />
    </div>
  );
}
