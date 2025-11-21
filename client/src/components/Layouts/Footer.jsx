import React from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Heart,
  ChevronUp,
  Mail,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; 

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate(); 

  const socialLinks = [
    { icon: <Facebook size={20} />, href: "https://facebook.com", label: "Facebook" },
    { icon: <Twitter size={20} />, href: "https://twitter.com", label: "Twitter" },
    { icon: <Instagram size={20} />, href: "https://instagram.com", label: "Instagram" },
    { icon: <Linkedin size={20} />, href: "https://linkedin.com", label: "LinkedIn" },
  ];

  const companyLinks = [
    { path: "/about", label: "About Us" },
    { path: "/features", label: "Features" }, 
    { path: "/careers", label: "Careers" },
  ];

  const supportLinks = [
    { path: "/help", label: "Help Center" },
    { path: "/contact", label: "Contact Us" }, 
    { path: "/faq", label: "FAQ" },
  ];

  const legalLinks = [
    { href: "#privacy", label: "Privacy Policy" },
    { href: "#terms", label: "Terms of Service" },
    { href: "#cookies", label: "Cookie Policy" },
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert("Subscribed to newsletter!");
  };
  const handleNavigate = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="bg-gradient-to-r from-indigo-950 via-gray-900 to-gray-800 text-gray-300 font-lato"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo, Description, and Social Links */}
          <div className="flex flex-col items-start">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              onClick={() => handleNavigate("/")}
              className="text-3xl font-extrabold font-poppins tracking-poppins-tight text-white mb-4 cursor-pointer"
            >
              NEXUS
            </motion.button>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed font-lato">
              Empowering HR excellence with innovative, unified solutions.
            </p>
            <div className="flex space-x-4 mb-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, color: "#4f46e5" }}
                  whileTap={{ scale: 0.9 }}
                  className="text-gray-400 hover:text-indigo-400 transition-colors duration-200"
                  aria-label={`Visit our ${social.label} page`}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center text-sm text-indigo-400 hover:text-indigo-300 transition-colors duration-200 font-lato"
              aria-label="Scroll to top"
            >
              <ChevronUp size={16} className="mr-1" />
              Back to Top
            </motion.button>
          </div>

          {/* Company Links - Updated with navigation */}
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold font-poppins tracking-poppins-tight text-white mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5, color: "#4f46e5" }}
                  className="text-sm text-gray-400 hover:text-indigo-400 transition-colors duration-200 font-lato"
                >
                  <button 
                    onClick={() => handleNavigate(link.path)}
                    className="text-left hover:underline cursor-pointer"
                    aria-label={link.label}
                  >
                    {link.label}
                  </button>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Support Links - Updated with navigation */}
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold font-poppins tracking-poppins-tight text-white mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              {supportLinks.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5, color: "#4f46e5" }}
                  className="text-sm text-gray-400 hover:text-indigo-400 transition-colors duration-200 font-lato"
                >
                  <button 
                    onClick={() => handleNavigate(link.path)}
                    className="text-left hover:underline cursor-pointer"
                    aria-label={link.label}
                  >
                    {link.label}
                  </button>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold font-poppins tracking-poppins-tight text-white mb-4">
              Stay Updated
            </h3>
            <p className="text-sm text-gray-400 mb-4 font-lato">
              Subscribe for the latest HR insights and updates.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col space-y-3">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="relative"
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 rounded-full bg-gray-800 border border-gray-700 text-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300 placeholder-gray-500 font-lato"
                  aria-label="Email for newsletter"
                  required
                />
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-2 rounded-full font-semibold text-sm hover:shadow-lg transition-all duration-300 font-lato"
                aria-label="Subscribe to newsletter"
              >
                Subscribe
              </motion.button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between text-xs md:text-sm text-gray-400 font-lato">
            <span>© {currentYear} Nexus. All rights reserved.</span>
            <motion.div
              className="flex items-center mt-4 md:mt-0"
              whileHover={{ color: "#e11d48" }}
            >
              <span>Built with</span>
              <Heart size={16} className="text-rose-500 mx-1 animate-pulse" />
              <span>by APBC Africa</span>
            </motion.div>
            <motion.a
              href="#sitemap"
              whileHover={{ color: "#4f46e5" }}
              className="mt-4 md:mt-0 text-gray-400 hover:text-indigo-400 transition-colors duration-200 font-lato"
              aria-label="View sitemap"
            >
              Sitemap
            </motion.a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;