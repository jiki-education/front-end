import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="mb-4 text-lg font-bold">Jiki</h3>
            <p className="text-sm text-gray-600">Learn to code through interactive exercises and lessons.</p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="mb-4 font-semibold">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-blue-600">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/articles" className="text-gray-600 hover:text-blue-600">
                  Articles
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-blue-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-blue-600">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t pt-6 text-center text-sm text-gray-600">
          <p>&copy; {currentYear} Jiki. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
