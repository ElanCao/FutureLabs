import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <Link
              href="/"
              className="font-bold text-xl text-white tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded"
            >
              FutureLab
            </Link>
            <p className="mt-3 text-sm leading-relaxed">
              The future that humans live with AI — a platform where human
              skills meet agent intelligence.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-2 text-sm" role="list">
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Product
            </h3>
            <ul className="space-y-2 text-sm" role="list">
              <li>
                <Link
                  href="/product"
                  className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded"
                >
                  Platform
                </Link>
              </li>
              <li>
                <Link
                  href="/product#how-it-works"
                  className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded"
                >
                  How it works
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Connect
            </h3>
            <ul className="space-y-2 text-sm" role="list">
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded"
                >
                  Get in touch
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p>
            &copy; {new Date().getFullYear()} FutureLab. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
