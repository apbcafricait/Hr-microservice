import React from "react";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Heart
} from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <Facebook size={20} />, href: "#", label: "Facebook" },
    { icon: <Twitter size={20} />, href: "#", label: "Twitter" },
    { icon: <Instagram size={20} />, href: "#", label: "Instagram" },
    { icon: <Linkedin size={20} />, href: "#", label: "LinkedIn" },
  ];

  return (
    <motion.footer 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-gray-900 text-gray-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          {/* Logo and Social Links */}
          <div className="flex flex-col items-start">
            <motion.h2 
              whileHover={{ scale: 1.05 }}
              className="text-2xl md:text-3xl font-bold text-white mb-6"
            >
              NEXUS
            </motion.h2>
            <div className="flex space-x-4 mb-4">
              {socialLinks.map((social, index) => (
                <motion.a 
                  key={index} 
                  href={social.href} 
                  whileHover={{ scale: 1.1, color: "#4f46e5" }}
                  className="text-gray-400 hover:text-indigo-400 transition-colors duration-200"
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
            <p className="text-sm text-gray-400">Connecting HR excellence with innovative solutions.</p>
          </div>

          {/* Navigation Links */}
          <div className="col-span-1 md:col-span-3 flex flex-col md:flex-row justify-end space-y-6 md:space-y-0 md:space-x-8">
            <div className="flex flex-col space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
              <a href="#" className="text-sm md:text-base hover:text-indigo-400 transition-colors duration-200">
                About Us
              </a>
              <a href="#" className="text-sm md:text-base hover:text-indigo-400 transition-colors duration-200">
                Features
              </a>
            </div>
            <div className="flex flex-col space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
              <a href="#" className="text-sm md:text-base hover:text-indigo-400 transition-colors duration-200">
                Help Center
              </a>
              <a href="#" className="text-sm md:text-base hover:text-indigo-400 transition-colors duration-200">
                Contact
              </a>
            </div>
            <div className="flex flex-col space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
              <a href="#" className="text-sm md:text-base hover:text-indigo-400 transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="text-sm md:text-base hover:text-indigo-400 transition-colors duration-200">
                Terms of Service
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 md:mt-8 border-t border-gray-800 pt-4">
          <div className="flex flex-col md:flex-row items-center justify-between text-xs md:text-sm">
            <span className="text-gray-400">© {currentYear} Nexus. All rights reserved.</span>
            <div className="flex items-center mt-2 md:mt-0 text-gray-400">
              <span>Built with</span>
              <Heart size={16} className="text-rose-500 mx-1 animate-pulse" />
              <span>by APBC Africa</span>
            </div>
            <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200 mt-2 md:mt-0">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;