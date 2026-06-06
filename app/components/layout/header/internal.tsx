import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-72 bg-white border-b-2 border-gray-200 flex items-center justify-between px-40 z-modal">
      <Link href="/" aria-label="Jiki home" className="flex items-center text-gray-900">
        <Image src="/static/images/logo-5.png" alt="Jiki" width={114} height={40} className="h-40 w-auto" priority />
      </Link>

      <div className="flex items-center gap-12">
        <Link href="/dashboard" className="ui-btn ui-btn-small ui-btn-primary">
          Back to Jiki →
        </Link>
      </div>
    </header>
  );
}
