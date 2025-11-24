import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Book, 
  Video, 
  MessageCircle, 
  FileText, 
  Users, 
  Settings, 
  BarChart3,
  ChevronRight,
  Phone,
  Mail,
  Clock,
  ArrowRight
} from 'lucide-react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import { useNavigate } from 'react-router-dom';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const categories = [
    {
      icon: Users,
      title: "Getting Started",
      description: "Learn the basics of Nexus HR",
      articles: [
        "Setting up your first organization",
        "Inviting team members",
        "Basic navigation guide",
        "Account settings overview"
      ]
    },
    {
      icon: Settings,
      title: "Employee Management",
      description: "Manage your workforce effectively",
      articles: [
        "Adding new employees",
        "Creating employee profiles",
        "Managing organizational charts", 
        "Employee onboarding process"
      ]
    },
    {
      icon: BarChart3,
      title: "Payroll & Benefits",
      description: "Handle payroll and employee benefits",
      articles: [
        "Setting up payroll",
        "Managing employee benefits",
        "Tax calculations and compliance",
        "Generating pay slips"
      ]
    },
    {
      icon: FileText,
      title: "Leave Management",
      description: "Track and approve employee leave",
      articles: [
        "Configuring leave policies",
        "Processing leave requests",
        "Leave balance tracking",
        "Holiday calendar setup"
      ]
    },
    {
      icon: BarChart3,
      title: "Reports & Analytics",
      description: "Generate insights and reports",
      articles: [
        "Creating custom reports",
        "Understanding HR metrics",
        "Exporting data",
        "Setting up dashboards"
      ]
    },
    {
      icon: Settings,
      title: "Account Settings",
      description: "Configure your account and preferences",
      articles: [
        "User permissions and roles",
        "Security settings",
        "Integration setup",
        "Billing and subscription"
      ]
    }
  ];

  const popularArticles = [
    { title: "How to add a new employee", category: "Employee Management", readTime: "3 min" },
    { title: "Setting up leave policies", category: "Leave Management", readTime: "5 min" },
    { title: "Generating monthly reports", category: "Reports", readTime: "4 min" },
    { title: "Configuring payroll settings", category: "Payroll", readTime: "7 min" },
    { title: "Managing user permissions", category: "Settings", readTime: "4 min" }
  ];

  const resources = [
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Step-by-step video guides",
      action: "Watch Now"
    },
    {
      icon: Book,
      title: "User Guide",
      description: "Comprehensive documentation",
      action: "Read Guide"
    },
    {
      icon: MessageCircle,
      title: "Community Forum",
      description: "Connect with other users",
      action: "Join Discussion"
    }
  ];

  const handleContactUs = () => {
    navigate('/contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="pt-24 pb-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-bold mb-6"
            >
              Help Center
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8"
            >
              Find answers, get support, and learn how to make the most of Nexus HR
            </motion.p>
            
            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-2xl mx-auto relative"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for help articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Quick Contact */}
        <section className="py-12 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-center p-6 bg-blue-50 rounded-xl"
              >
                <Phone className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">Phone Support</h3>
                <p className="text-gray-600 mb-3">Mon-Fri, 9AM-6PM EAT</p>
                <p className="text-blue-600 font-medium">+254 746 051 906</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center p-6 bg-green-50 rounded-xl"
              >
                <Mail className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">Email Support</h3>
                <p className="text-gray-600 mb-3">Get help within 24 hours</p>
                <button 
                  onClick={handleContactUs}
                  className="text-green-600 font-medium hover:underline"
                >
                  Contact Us
                </button>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center p-6 bg-purple-50 rounded-xl"
              >
                <MessageCircle className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
                <p className="text-gray-600 mb-3">Chat with our support team</p>
                <button className="text-purple-600 font-medium hover:underline">
                  Start Chat
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-center mb-16"
            >
              Browse by Category
            </motion.h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                  >
                    <Icon className="w-12 h-12 text-indigo-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-3">{category.title}</h3>
                    <p className="text-gray-600 mb-6">{category.description}</p>
                    <ul className="space-y-2">
                      {category.articles.map((article, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-600 hover:text-indigo-600 cursor-pointer">
                          <ChevronRight className="w-4 h-4 mr-2 text-indigo-400" />
                          {article}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Popular Articles */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-center mb-16"
            >
              Popular Articles
            </motion.h2>
            
            <div className="max-w-4xl mx-auto space-y-4">
              {popularArticles.map((article, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 p-6 rounded-xl hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">
                          {article.category}
                        </span>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {article.readTime} read
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Resources */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-center mb-16"
            >
              Additional Resources
            </motion.h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {resources.map((resource, index) => {
                const Icon = resource.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow duration-300"
                  >
                    <Icon className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold mb-3">{resource.title}</h3>
                    <p className="text-gray-600 mb-6">{resource.description}</p>
                    <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200">
                      {resource.action}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Still Need Help */}
        <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold mb-6"
            >
              Still Need Help?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl mb-8 max-w-2xl mx-auto"
            >
              Can't find what you're looking for? Our support team is here to help you get the most out of Nexus HR.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center"
            >
              <button 
                onClick={handleContactUs}
                className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                Contact Support
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors duration-200">
                Schedule Call
              </button>
            </motion.div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default HelpCenter;