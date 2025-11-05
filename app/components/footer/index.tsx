import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-border-primary bg-bg-secondary">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-text-primary">Jiki</h3>
            <p className="text-sm text-text-secondary">Learn to code through interactive exercises and lessons.</p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="mb-4 font-semibold text-text-primary">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blog" className="text-text-secondary hover:text-link-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/articles" className="text-text-secondary hover:text-link-primary transition-colors">
                  Articles
                </Link>
              </li>
              <li>
                <Link href="/concepts" className="text-text-secondary hover:text-link-primary transition-colors">
                  Concepts
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-text-secondary hover:text-link-primary transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 font-semibold text-text-primary">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-text-secondary hover:text-link-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-text-secondary hover:text-link-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-border-primary pt-6 text-center text-sm text-text-secondary">
          <p>&copy; {currentYear} Jiki. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
