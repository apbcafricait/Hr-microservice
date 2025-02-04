import React from 'react';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Heart
} from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <Facebook size={20} />, href: '#', label: 'Facebook' },
    { icon: <Twitter size={20} />, href: '#', label: 'Twitter' },
    { icon: <Instagram size={20} />, href: '#', label: 'Instagram' },
    { icon: <Linkedin size={20} />, href: '#', label: 'LinkedIn' }
  ];

  return (
    <motion.footer 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-white text-gray-600"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="flex flex-col items-start">
            <h2 className="text-xl font-semibold mb-4">Nexus</h2>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a 
                  key={index} 
                  href={social.href} 
                  whileHover={{ scale: 1.1 }}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>
          <div className="col-span-2 flex justify-end space-x-4">
            <a href="#" className="text-base hover:text-gray-900">About Us</a>
            <a href="#" className="text-base hover:text-gray-900">Features</a>
            <a href="#" className="text-base hover:text-gray-900">Help Center</a>
            <a href="#" className="text-base hover:text-gray-900">Contact</a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 border-t border-gray-200 pt-4">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm md:text-base">
            <span>© {currentYear} Nexus. All rights reserved.</span>
            <div className="flex items-center mt-2 md:mt-0">
              <span>Developed with</span>
              <Heart size={18} className="text-red-500 mx-1" />
              <span>by APBC Africa</span>
            </div>
            <div className="flex mt-2 md:mt-0">
              <a href="#" className="hover:text-gray-900 ml-4">Privacy Policy</a>
              <a href="#" className="hover:text-gray-900 ml-4">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;