import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../Layouts/Header";
import Footer from "../../Layouts/Footer";
import {
  Users,
  BarChart3,
  Clock,
  Shield,
  CheckCircle,
  Database,
  Zap,
  Globe,
  HeartHandshake,
  ArrowRight,
  Search,
  Play,
  X,
  ChevronUp,
} from "lucide-react";

const LandingPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showVideo, setShowVideo] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Handle scroll for back-to-top button
  React.useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: <Users className="h-10 w-10 text-indigo-600" />,
      title: "Employee Management",
      description: "Streamline workforce management with comprehensive profiles and automated HR processes.",
      category: "HR",
    },
    {
      icon: <CheckCircle className="h-10 w-10 text-emerald-600" />,
      title: "Payroll Management",
      description: "Automated payroll with tax compliance and direct deposit integration.",
      category: "Payroll",
    },
    {
      icon: <BarChart3 className="h-10 w-10 text-blue-600" />,
      title: "Analytics & Reporting",
      description: "Real-time, data-driven insights with customizable reports.",
      category: "Analytics",
    },
    {
      icon: <Clock className="h-10 w-10 text-orange-600" />,
      title: "Time & Attendance",
      description: "Automated tracking for enhanced workforce productivity.",
      category: "Time",
    },
    {
      icon: <Shield className="h-10 w-10 text-rose-600" />,
      title: "Compliance Management",
      description: "Stay compliant with automated regulatory updates and alerts.",
      category: "Compliance",
    },
  ];

  const benefits = [
    {
      icon: <Zap className="h-8 w-8 text-amber-500" />,
      title: "Increased Efficiency",
      description: "Reduce administrative tasks by 60% with automation.",
    },
    {
      icon: <Database className="h-8 w-8 text-emerald-500" />,
      title: "Data Security",
      description: "Enterprise-grade encryption and security protocols.",
    },
    {
      icon: <Globe className="h-8 w-8 text-blue-500" />,
      title: "Global Accessibility",
      description: "Access from any device, anytime, anywhere.",
    },
    {
      icon: <HeartHandshake className="h-8 w-8 text-rose-500" />,
      title: "Employee Satisfaction",
      description: "Boost engagement and retention with intuitive tools.",
    },
  ];

  const testimonials = [
    {
      name: "Sylvester Omondi",
      role: "HR Manager, TechCorp",
      quote: "Nexus transformed our HR processes, saving us hours weekly and improving employee satisfaction.",
      company: "TechCorp",
    },
    {
      name: "Sir Ngugi Wainaina",
      role: "CEO, Innovate Solutions",
      quote: "The analytics have been a game-changer for strategic decisions in our workforce management.",
      company: "Innovate Solutions",
    },
  ];

  return (
    <div className="w-full bg-gray-50 antialiased font-lato">
      <Header />
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-gradient-to-br from-indigo-900 via-gray-900 to-gray-800 text-white overflow-hidden"
      >
        <div className="absolute inset-0 opacity-15">
          <div className="absolute w-[600px] h-[600px] bg-gradient-to-r from-indigo-400/20 to-blue-400/20 animate-spin-slow blur-3xl" />
          <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-gradient-to-l from-blue-400/20 to-indigo-400/20 animate-pulse blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
          <div className="text-center">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-poppins mb-6 leading-tight tracking-tight"
            >
              Transform Your HR with{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Nexus
              </span>
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto font-lato font-light"
            >
              A unified platform for HR management, payroll, and workforce analytics
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="relative max-w-lg mx-auto mb-10"
            >
              <input
                type="text"
                placeholder="Search features or solutions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-4 rounded-full border border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300 placeholder-gray-400 bg-white/90 shadow-md text-gray-800 font-lato"
                aria-label="Search features"
              />
              <Search className="absolute right-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300 shadow-md shadow-indigo-600/30 font-lato"
                aria-label="Schedule a demo"
              >
                Schedule Demo
                <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group border-2 border-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300 font-lato"
                onClick={() => setShowVideo(true)}
                aria-label="Watch demo video"
              >
                Watch Demo
                <Play className="inline ml-2 h-5 w-5 group-hover:animate-pulse" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-poppins text-gray-900 mb-4"
            >
              Enterprise-Grade HR Solutions
            </motion.h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto font-lato">
              Discover tools designed for modern workforce management
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features
              .filter(
                (feature) =>
                  feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  feature.description.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-300"
                  whileHover={{ scale: 1.03 }}
                >
                  <div className="mb-6 bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 font-poppins">
                    {feature.title}
                  </h3>
                  <p className="text-base text-gray-600 leading-relaxed font-lato">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
          </div>
          {searchQuery &&
            features.filter(
              (feature) =>
                feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                feature.description.toLowerCase().includes(searchQuery.toLowerCase())
            ).length === 0 && (
              <p className="text-center text-gray-500 mt-8 font-lato">No features found matching your search.</p>
            )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-poppins text-gray-900 mb-4"
            >
              Why Enterprises Choose Nexus
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-gray-50 p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-300"
                whileHover={{ scale: 1.03 }}
              >
                <div className="mb-6 bg-indigo-100 w-14 h-14 rounded-full flex items-center justify-center">
                  {benefit.icon}
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 font-poppins">
                  {benefit.title}
                </h3>
                <p className="text-base text-gray-600 font-lato">{benefit.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <p className="text-lg text-gray-600 italic mb-4 font-lato">“{testimonial.quote}”</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 font-semibold font-lato">{testimonial.name[0]}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 font-poppins">{testimonial.name}</p>
                    <p className="text-sm text-gray-600 font-lato">{testimonial.role}</p>
                    <p className="text-sm text-gray-500 font-lato">{testimonial.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-gradient-to-r from-indigo-900 via-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-poppins text-white mb-8"
          >
            Ready to Transform Your HR?
          </motion.h2>

          <motion.div whileHover={{ scale: 1.05 }} className="inline-block mb-6">
            <button
              className="group bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-10 py-4 rounded-full font-semibold text-lg hover:shadow-2xl transition-all duration-300 shadow-md shadow-indigo-600/30 font-lato"
              onClick={() => setShowVideo(true)}
              aria-label="Watch demo video"
            >
              Watch Demo
              <Play className="inline ml-2 h-5 w-5 group-hover:animate-pulse" />
            </button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} className="inline-block">
            <button
              className="group bg-white text-indigo-600 px-10 py-4 rounded-full font-semibold text-lg hover:bg-indigo-50 hover:shadow-lg transition-all duration-300 border border-indigo-200 font-lato"
              aria-label="Start free trial"
            >
              Start Free Trial
              <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl p-6 max-w-4xl w-full shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800 font-poppins">Nexus Demo Video</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowVideo(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                  aria-label="Close video modal"
                >
                  <X className="h-6 w-6 text-gray-600" />
                </motion.button>
              </div>
              <div className="aspect-video">
                <iframe
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ" // Replace with actual demo video URL
                  title="Nexus Demo"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full rounded-lg"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300"
            aria-label="Scroll to top"
          >
            <ChevronUp className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default LandingPage;