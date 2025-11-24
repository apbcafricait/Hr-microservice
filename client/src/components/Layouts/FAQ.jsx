import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  MessageCircle, 
  Phone, 
  Mail,
  HelpCircle,
  Users,
  Settings,
  DollarSign,
  Shield
} from 'lucide-react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import { useNavigate } from 'react-router-dom';

const FAQ = () => {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  const categories = [
    { id: 'All', label: 'All Questions', icon: HelpCircle },
    { id: 'General', label: 'General', icon: Users },
    { id: 'Account', label: 'Account & Billing', icon: Settings },
    { id: 'Features', label: 'Features', icon: Users },
    { id: 'Pricing', label: 'Pricing', icon: DollarSign },
    { id: 'Security', label: 'Security', icon: Shield }
  ];

  const faqs = [
    {
      category: 'General',
      question: "What is Nexus HR and how does it work?",
      answer: "Nexus HR is a comprehensive human resources management platform that streamlines HR operations for businesses of all sizes. It includes employee management, payroll processing, leave management, performance tracking, and analytics tools all in one integrated system."
    },
    {
      category: 'General',
      question: "Who can benefit from using Nexus HR?",
      answer: "Nexus HR is designed for businesses of all sizes, from startups with a few employees to large enterprises with thousands of workers. It's particularly beneficial for HR teams, managers, and business owners who want to automate and streamline their HR processes."
    },
    {
      category: 'Account',
      question: "How do I get started with Nexus HR?",
      answer: "Getting started is easy! Simply sign up for a free trial, set up your organization profile, invite your team members, and start exploring the features. Our onboarding team will guide you through the initial setup process."
    },
    {
      category: 'Account',
      question: "Can I import existing employee data?",
      answer: "Yes, absolutely! Nexus HR supports bulk data import from CSV files and can integrate with most existing HR systems. Our migration team will help you transfer your existing employee data seamlessly."
    },
    {
      category: 'Features',
      question: "What employee information can I track?",
      answer: "You can track comprehensive employee information including personal details, job history, performance reviews, skills and certifications, leave balances, salary information, and much more. The system is fully customizable to match your organization's needs."
    },
    {
      category: 'Features',
      question: "Does Nexus HR handle payroll processing?",
      answer: "Yes, our platform includes a full-featured payroll system that handles salary calculations, tax deductions, overtime, bonuses, and direct deposits. It complies with local tax regulations and generates all necessary payroll reports."
    },
    {
      category: 'Features',
      question: "Can employees access their information directly?",
      answer: "Yes, employees have access to a self-service portal where they can view their profiles, request leave, check pay slips, update personal information, and access company documents. This reduces administrative burden on HR teams."
    },
    {
      category: 'Pricing',
      question: "What are the pricing plans for Nexus HR?",
      answer: "We offer three main plans: Starter ($5/employee/month), Professional ($12/employee/month), and Enterprise (custom pricing). Each plan includes different features and support levels. Check our pricing page for detailed comparisons."
    },
    {
      category: 'Pricing',
      question: "Is there a free trial available?",
      answer: "Yes, we offer a 14-day free trial for all our plans. You can explore all features during the trial period with no commitment required. No credit card is needed to start your trial."
    },
    {
      category: 'Pricing',
      question: "Can I change my plan later?",
      answer: "Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately for upgrades and at the next billing cycle for downgrades. Our support team can help with plan changes."
    },
    {
      category: 'Security',
      question: "How secure is my company's data?",
      answer: "Security is our top priority. We use enterprise-grade encryption, regular security audits, SOC 2 compliance, and follow industry best practices. Your data is stored in secure data centers with multiple backup systems."
    },
    {
      category: 'Security',
      question: "Where is my data stored?",
      answer: "Data is stored in secure, internationally certified data centers with 99.9% uptime guarantee. We offer data residency options to comply with local regulations. All data is encrypted both in transit and at rest."
    },
    {
      category: 'Account',
      question: "What kind of support do you provide?",
      answer: "We provide comprehensive support including email support (24-hour response), live chat during business hours, phone support for Enterprise customers, video tutorials, documentation, and a community forum."
    },
    {
      category: 'Features',
      question: "Can Nexus HR integrate with other tools?",
      answer: "Yes, we offer integrations with popular tools like Slack, Microsoft Teams, accounting software (QuickBooks, Xero), and can connect via our REST API. Custom integrations are available for Enterprise customers."
    },
    {
      category: 'General',
      question: "How often do you update the platform?",
      answer: "We release new features and improvements monthly, with security updates and bug fixes deployed as needed. All updates are automatic and don't require any downtime. Users are notified of major new features via email."
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

 const handleContactUs = () => {
    navigate('/contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handlePhoneCall = () => {
    window.location.href = 'tel:+254735277427'; 
  };

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="pt-24 pb-16 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-bold mb-6"
            >
              Frequently Asked Questions
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8"
            >
              Find quick answers to common questions about Nexus HR
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
                  placeholder="Search FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center px-6 py-3 rounded-full font-medium transition-colors duration-200 ${
                      selectedCategory === category.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ List */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-12">
                <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No FAQs found</h3>
                <p className="text-gray-500">Try a different search term or category.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFAQs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full px-8 py-6 text-left focus:outline-none focus:ring-4 focus:ring-indigo-200 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {faq.question}
                          </h3>
                          <span className="text-sm text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">
                            {faq.category}
                          </span>
                        </div>
                        <div className="ml-4">
                          {openFAQ === index ? (
                            <ChevronUp className="w-6 h-6 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-6 h-6 text-gray-500" />
                          )}
                        </div>
                      </div>
                    </button>
                    
                    <AnimatePresence>
                      {openFAQ === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-8 pb-6">
                            <div className="border-t border-gray-200 pt-6">
                              <p className="text-gray-600 leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Contact CTA */}
  <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold mb-6"
            >
              Still Have Questions?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl mb-8 max-w-2xl mx-auto"
            >
              Can't find the answer you're looking for? Our support team is ready to help!
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            >
              <button 
                onClick={handleContactUs}
                className="bg-white text-indigo-600 p-6 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-200 flex flex-col items-center"
              >
                <Mail className="w-8 h-8 mb-3" />
                <span>Email Support</span>
                <span className="text-sm text-gray-500 mt-1">24h response</span>
              </button>
              <button 
                onClick={handlePhoneCall}
                className="bg-white text-indigo-600 p-6 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-200 flex flex-col items-center"
              >
                <Phone className="w-8 h-8 mb-3" />
                <span>Phone Support</span>
                <span className="text-sm text-gray-500 mt-1">Mon-Fri 9-6</span>
              </button>
              
              <button className="bg-white text-indigo-600 p-6 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-200 flex flex-col items-center">
                <MessageCircle className="w-8 h-8 mb-3" />
                <span>Live Chat</span>
                <span className="text-sm text-gray-500 mt-1">Instant help</span>
              </button>
            </motion.div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default FAQ;