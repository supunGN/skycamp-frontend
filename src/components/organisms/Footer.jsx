import { Link } from "react-router-dom";
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-700 pt-20">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-4 pb-12 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {/* Logo and Contact */}
        <div className="space-y-4">
          <img src="/logo.svg" alt="SkyCamp Logo" className="h-10" />
          <div className="flex items-center space-x-2">
            <EnvelopeIcon className="w-5 h-5" />
            <a href="mailto:ask@skycamp.com" className="underline font-medium">
              ask@skycamp.com
            </a>
          </div>
          <div className="flex items-center space-x-2">
            <PhoneIcon className="w-5 h-5" />
            <span className="font-medium">+94 774 50 21</span>
          </div>
          <div className="flex space-x-4 pt-2">
            <a href="#">
              <FaTiktok className="text-2xl text-gray-500 hover:text-cyan-600" />
            </a>
            <a href="#">
              <FaFacebookF className="text-2xl text-gray-500 hover:text-cyan-600" />
            </a>
            <a href="#">
              <FaInstagram className="text-2xl text-gray-500 hover:text-cyan-600" />
            </a>
          </div>
        </div>

        {/* Columns */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-500">More Info</h3>
          <Link
            to="/faq"
            className="hover:text-cyan-600 font-semibold block"
            onClick={() => window.scrollTo(0, 0)}
          >
            FAQ
          </Link>
          <Link
            to="/about"
            className="hover:text-cyan-600 font-semibold block"
            onClick={() => window.scrollTo(0, 0)}
          >
            About Us
          </Link>
          <Link
            to="/contact-us"
            className="hover:text-cyan-600 font-semibold block"
            onClick={() => window.scrollTo(0, 0)}
          >
            Contact Us
          </Link>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-gray-500">Services</h3>
          <Link
            to="/hire-guide"
            className="hover:text-cyan-600 font-semibold block"
          >
            Hire Guide
          </Link>
          <Link
            to="/travel-buddy"
            className="hover:text-cyan-600 font-semibold block"
          >
            Travel Buddy
          </Link>
          <Link
            to="/equipment"
            className="hover:text-cyan-600 font-semibold block"
          >
            Find Equipment
          </Link>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-gray-500">Explore Location</h3>
          <Link
            to="/destinations"
            className="hover:text-cyan-600 font-semibold block"
          >
            Camping Destinations
          </Link>
          <Link
            to="/stargazing-spots"
            className="hover:text-cyan-600 font-semibold block"
          >
            Stargazing Spots
          </Link>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-gray-500">Social</h3>
          <a href="#" className="hover:text-cyan-600 font-semibold block">
            TikTok
          </a>
          <a href="#" className="hover:text-cyan-600 font-semibold block">
            Facebook
          </a>
          <a href="#" className="hover:text-cyan-600 font-semibold block">
            Instagram
          </a>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-gray-50 border-t text-sm text-gray-500">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row justify-between items-center">
          <p>© 2025 SkyCamp. All rights reserved.</p>
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <Link
              to="/privacy"
              className="hover:text-cyan-600"
              onClick={() => window.scrollTo(0, 0)}
            >
              Privacy & Cookies
            </Link>
            <span className="border-l h-5"></span>
            <Link
              to="/terms"
              className="hover:text-cyan-600"
              onClick={() => window.scrollTo(0, 0)}
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
