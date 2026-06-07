import Image from "next/image";
import Link from "next/link";
import shared from "@/components/landing-page/shared.module.css";

const navLinkStyle = { borderBottom: "1px solid var(--color-gray-400)", lineHeight: 1.2 };

export default function ExternalHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 h-72 bg-white border-b-2 border-gray-200 z-[1000]">
      <div className={`${shared["lg-container"]} h-full flex items-center gap-36`}>
        <Link href="/" aria-label="Jiki home" className="flex items-center text-gray-900">
          <Image src="/static/images/logo-6.png" alt="Jiki" width={102} height={40} className="h-40 w-auto" priority />
        </Link>

        <div className="flex items-center gap-12 font-medium text-gray-700 max-[719px]:hidden">
          <Link href="https://jiki.io/blog/the-backstory-of-jiki" style={navLinkStyle}>
            About
          </Link>
          <Link href="/premium" style={navLinkStyle}>
            Premium
          </Link>
          <Link href="/testimonials" style={navLinkStyle}>
            Testimonials
          </Link>
        </div>

        <div className="flex items-center gap-12 ml-auto">
          <Link href="/auth/login" className="ui-btn ui-btn-small ui-btn-secondary">
            Login
          </Link>
          <Link href="/auth/signup" className="ui-btn ui-btn-small ui-btn-primary">
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}
