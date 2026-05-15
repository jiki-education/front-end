import Link from "next/link";
import JikiLogo from "@/icons/jiki-logo.svg";
import shared from "@/components/landing-page/shared.module.css";

export default function ExternalHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 h-72 bg-white border-b-2 border-gray-200 z-[1000]">
      <div className={`${shared["lg-container"]} h-full flex items-center justify-between`}>
        <Link href="/" aria-label="Jiki home" className="flex items-center text-gray-900">
          <JikiLogo className="h-40 w-auto" />
        </Link>

        <div className="flex items-center gap-12">
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
