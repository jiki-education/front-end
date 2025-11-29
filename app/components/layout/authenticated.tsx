import Footer from "./footer";
import Header from "./header/internal";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 mt-[70px]">{children}</main>
      <Footer />
    </div>
  );
}
