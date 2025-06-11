import { FaFacebookF, FaTwitter, FaYoutube, FaInstagram } from 'react-icons/fa'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <footer className="bg-[#0d0d0d] text-white text-sm pt-10 pb-5 px-6 sm:px-16 w-full">
      {/* Top Row - Social Icons and Logo */}
      <div className="flex justify-between items-center flex-wrap gap-6 mb-6 border-b border-gray-700 pb-6">
        <div className="flex gap-5 text-lg">
          <FaFacebookF className="cursor-pointer hover:text-red-500" />
          <FaTwitter className="cursor-pointer hover:text-red-500" />
          <FaYoutube className="cursor-pointer hover:text-red-500" />
          <FaInstagram className="cursor-pointer hover:text-red-500" />
        </div>
        <img src={assets.logo} alt="Vois Logo" className="w-8 h-8 object-contain" />
      </div>

      {/* Middle Grid - 3 Columns */}
      <div className="grid gap-10 text-gray-300 md:grid-cols-3 mb-10 text-left">
        <div>
          <h3 className="text-white font-semibold mb-4">About Vois</h3>
          <ul className="space-y-2">
            <li className="cursor-pointer hover:text-white">Careers</li>
            <li className="cursor-pointer hover:text-white">Press Releases</li>
            <li className="cursor-pointer hover:text-white">Advertisements</li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-4">Vois Services</h3>
          <ul className="space-y-2">
            <li className="cursor-pointer hover:text-white">Shop</li>
            <li className="cursor-pointer hover:text-white">DSL</li>
            <li className="cursor-pointer hover:text-white">Internet</li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-4">Help</h3>
          <ul className="space-y-2">
            <li className="cursor-pointer hover:text-white">FAQs</li>
            <li className="cursor-pointer hover:text-white">Contact Us</li>
            <li className="cursor-pointer hover:text-white">Branch Locator</li>
          </ul>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="flex flex-wrap justify-center gap-5 text-xs text-gray-500 border-t border-gray-700 pt-5">
        <span className="cursor-pointer hover:text-white">Contact Us</span>
        <span className="cursor-pointer hover:text-white">Business Services</span>
        <span className="cursor-pointer hover:text-white">Terms & Conditions</span>
        <span className="cursor-pointer hover:text-white">Privacy Policy</span>
        <span className="text-center w-full md:w-auto mt-2 md:mt-0">© Vois E-commerce 2025</span>
      </div>
    </footer>
  )
}

export default Footer
