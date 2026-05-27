import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-16 sm:mt-24 md:mt-32 border-t border-gray-200 bg-[#fafafa]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-14">
        {/* Top section */}
        <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-12">
          {/* Brand */}
          <div className="max-w-sm">
            <h3 className="text-base sm:text-lg font-semibold">Unsent</h3>
            <p className="mt-3 text-xs sm:text-sm text-gray-600">
              A shared space for quiet writing.
              <br />
              Private when you want. Open when you choose.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-10 text-xs sm:text-sm">
            <div>
              <h4 className="mb-3 font-medium">Product</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="#" className="hover:text-black">
                    Write
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black">
                    Stories
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black">
                    Community
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-3 font-medium">Company</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link to="/about" className="hover:text-black">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-black">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-black">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-3 font-medium">Open Source</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a
                    href="https://github.com/JatinBhargava/unsent-ui"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-black"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/JatinBhargava/unsent-ui/pulls"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-black"
                  >
                    Contribute
                  </a>
                </li>
                <li>
                  <Link to="/changelog" className="hover:text-black">
                    Changelog
                  </Link>
                </li>
                <li>
                  <a
                    href="https://github.com/JatinBhargava/unsent-ui/issues"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-black"
                  >
                    Issues
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Unsent. All rights reserved.</p>
          <p>Built with care for expression and privacy.</p>
        </div>
      </div>
    </footer>
  );
}
