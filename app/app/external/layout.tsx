import Footer from "@/components/footer";
import ExternalHeader from "@/components/header/external";

export default function ExternalLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <ExternalHeader />
      <main className="flex-1 mt-[70px]">{children}</main>
      <Footer />
    </div>
  );
}
