import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#1a202c] text-[#cbd5e0] mt-60 pb-40">
      {/* Wave SVG decoration */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none -translate-y-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          className="relative block w-full h-60"
        >
          <path d="M0,0 Q360,60 720,30 T1440,0 L1440,60 L0,60 Z" fill="#1a202c"></path>
        </svg>
      </div>

      {/* Footer content */}
      <div className="max-w-[1200px] mx-auto px-40 pt-32 pb-0 flex justify-center gap-80 mb-40">
        {/* Jiki Logo */}
        <div className="flex flex-col items-start gap-8 -mt-12">
          <div className="text-32 font-bold text-white tracking-4">JIKI</div>
          <div className="w-60 h-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-3"></div>
        </div>

        {/* About Section */}
        <div className="flex flex-col">
          <h3 className="text-base font-bold text-white mb-16">About</h3>
          <div className="flex flex-col gap-12">
            <Link href="/about" className="text-[#cbd5e0] no-underline text-sm transition-colors hover:text-blue-500">
              About Jiki
            </Link>
            <Link href="/team" className="text-[#cbd5e0] no-underline text-sm transition-colors hover:text-blue-500">
              Our team
            </Link>
            <Link
              href="/contributors"
              className="text-[#cbd5e0] no-underline text-sm transition-colors hover:text-blue-500"
            >
              Contributors
            </Link>
            <Link
              href="/partners"
              className="text-[#cbd5e0] no-underline text-sm transition-colors hover:text-blue-500"
            >
              Partners
            </Link>
            <Link
              href="/supporters"
              className="text-[#cbd5e0] no-underline text-sm transition-colors hover:text-blue-500"
            >
              Individual supporters
            </Link>
          </div>
        </div>

        {/* Get Involved Section */}
        <div className="flex flex-col">
          <h3 className="text-base font-bold text-white mb-16">Get Involved</h3>
          <div className="flex flex-col gap-12">
            <Link
              href="/insiders"
              className="text-[#cbd5e0] no-underline text-sm transition-colors hover:text-blue-500"
            >
              Jiki Insiders
            </Link>
            <Link
              href="/contribute"
              className="text-[#cbd5e0] no-underline text-sm transition-colors hover:text-blue-500"
            >
              Contribute
            </Link>
            <Link href="/mentor" className="text-[#cbd5e0] no-underline text-sm transition-colors hover:text-blue-500">
              Mentor
            </Link>
            <Link href="/donate" className="text-[#cbd5e0] no-underline text-sm transition-colors hover:text-blue-500">
              Donate
            </Link>
          </div>
        </div>

        {/* Legal Section */}
        <div className="flex flex-col">
          <h3 className="text-base font-bold text-white mb-16">Legal</h3>
          <div className="flex flex-col gap-12">
            <Link href="/terms" className="text-[#cbd5e0] no-underline text-sm transition-colors hover:text-blue-500">
              Terms of usage
            </Link>
            <Link href="/privacy" className="text-[#cbd5e0] no-underline text-sm transition-colors hover:text-blue-500">
              Privacy policy
            </Link>
            <Link href="/cookies" className="text-[#cbd5e0] no-underline text-sm transition-colors hover:text-blue-500">
              Cookie policy
            </Link>
            <Link
              href="/code-of-conduct"
              className="text-[#cbd5e0] no-underline text-sm transition-colors hover:text-blue-500"
            >
              Code of conduct
            </Link>
            <Link
              href="/accessibility"
              className="text-[#cbd5e0] no-underline text-sm transition-colors hover:text-blue-500"
            >
              Accessibility statement
            </Link>
          </div>
        </div>

        {/* Keep in Touch Section */}
        <div className="flex flex-col">
          <h3 className="text-base font-bold text-white mb-16">Keep in Touch</h3>
          <div className="flex flex-col gap-12">
            <Link href="/blog" className="text-[#cbd5e0] no-underline text-sm transition-colors hover:text-blue-500">
              Jiki&apos;s blog
            </Link>
            <Link
              href="https://github.com"
              className="text-[#cbd5e0] no-underline text-sm transition-colors hover:text-blue-500"
            >
              Discuss on GitHub
            </Link>
            <Link href="/contact" className="text-[#cbd5e0] no-underline text-sm transition-colors hover:text-blue-500">
              Contact us
            </Link>
            <Link
              href="/report-abuse"
              className="text-[#cbd5e0] no-underline text-sm transition-colors hover:text-blue-500"
            >
              Report abuse
            </Link>
          </div>
        </div>

        {/* Get Help Section */}
        <div className="flex flex-col">
          <h3 className="text-base font-bold text-white mb-16">Get Help</h3>
          <div className="flex flex-col gap-12">
            <Link href="/docs" className="text-[#cbd5e0] no-underline text-sm transition-colors hover:text-blue-500">
              Jiki&apos;s Docs
            </Link>
            <Link
              href="/getting-started"
              className="text-[#cbd5e0] no-underline text-sm transition-colors hover:text-blue-500"
            >
              Getting started
            </Link>
            <Link href="/faqs" className="text-[#cbd5e0] no-underline text-sm transition-colors hover:text-blue-500">
              FAQs
            </Link>
            <Link href="/cli" className="text-[#cbd5e0] no-underline text-sm transition-colors hover:text-blue-500">
              Installing the CLI
            </Link>
            <Link
              href="/cli-walkthrough"
              className="text-[#cbd5e0] no-underline text-sm transition-colors hover:text-blue-500"
            >
              Interactive CLI Walkthrough
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="max-w-[1200px] mx-auto px-40 pt-20 border-t border-[#2d3748] flex justify-center items-center">
        <div className="text-sm text-[#718096]">&copy; {currentYear} Jiki</div>
      </div>
    </footer>
  );
}
