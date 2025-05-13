import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="hidden md:block bg-black text-white md:px-10 p-6 border-t-2 border-[#171717] text-center">
      <div className="space-y-4">
        <div className="flex justify-center items-center gap-6 text-lg md:text-xl">
          <span aria-label="Facebook">
            <FaFacebookF />
          </span>
          <span aria-label="Instagram">
            <FaInstagram />
          </span>
          <span aria-label="Twitter">
            <FaTwitter />
          </span>
          <span aria-label="YouTube">
            <FaYoutube />
          </span>
        </div>

        <p className="text-xs text-gray-500 pt-4">
          Copyright © 2025 | S-HOME. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
