import React from 'react';
import { motion } from 'framer-motion';
import Header from '../../Layouts/Header';
import Footer from '../../Layouts/Footer';
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
  ArrowRight
} from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: <Users className="h-10 w-10 text-violet-600" />,
      title: "Employee Management",
      description: "Streamline workforce management with comprehensive employee profiles and automated HR processes."
    },
    {
      icon: <CheckCircle className="h-10 w-10 text-emerald-600" />,
      title: "Payroll Management",
      description: "Automated payroll processing with tax compliance and direct deposit integration"
    },
    {
      icon: <BarChart3 className="h-10 w-10 text-blue-600" />,
      title: "Analytics & Reporting",
      description: "Data-driven decisions with real-time analytics and customizable reports"
    },
    {
      icon: <Clock className="h-10 w-10 text-orange-600" />,
      title: "Time & Attendance",
      description: "Automated tracking for improved workforce productivity"
    },
    {
      icon: <Shield className="h-10 w-10 text-rose-600" />,
      title: "Compliance Management",
      description: "Stay compliant with automated regulatory updates"
    }
  ];

  const benefits = [
    {
      icon: <Zap className="h-8 w-8 text-amber-500" />,
      title: "Increased Efficiency",
      description: "Reduce administrative tasks by 60%"
    },
    {
      icon: <Database className="h-8 w-8 text-emerald-500" />,
      title: "Data Security",
      description: "Enterprise-grade security protocols"
    },
    {
      icon: <Globe className="h-8 w-8 text-blue-500" />,
      title: "Global Accessibility",
      description: "Access from anywhere, anytime"
    },
    {
      icon: <HeartHandshake className="h-8 w-8 text-rose-500" />,
      title: "Employee Satisfaction",
      description: "Improve engagement and retention"
    }
  ];

  return (
    <div className="w-full font-['Inter'] bg-slate-50">
        <Header/>
      {/* Hero Section with enhanced animations */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-gradient-to-br from-violet-900 via-slate-900 to-slate-800 text-white overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute w-[600px] h-[600px] bg-gradient-to-r from-violet-500/30 to-purple-500/30 animate-spin-slow blur-3xl" />
          <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-gradient-to-l from-blue-500/30 to-indigo-500/30 animate-pulse blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-28 md:py-36 relative">
          <div className="text-center">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight tracking-tight"
            >
              Transform Your HR Operations with{' '}
              <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Nexus
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl sm:text-2xl md:text-3xl text-slate-200 mb-12 max-w-4xl mx-auto font-light"
            >
              Unified platform for HR management, payroll processing, and workforce analytics
            </motion.p>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row justify-center gap-6"
            >
              <button className="group bg-gradient-to-r from-violet-500 to-blue-600 text-white px-10 py-5 rounded-2xl font-semibold text-lg hover:scale-105 transition-all duration-300 shadow-xl shadow-violet-500/20">
                Schedule Demo
                <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="group border-2 border-white/20 text-white px-10 py-5 rounded-2xl font-semibold text-lg hover:bg-white/10 transition-all duration-300">
                Explore Features
                <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section with enhanced styling */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6"
            >
              Enterprise-Grade HR Solutions
            </motion.h2>
            <p className="text-slate-600 max-w-3xl mx-auto text-xl">
              Comprehensive tools for modern workforce management
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-slate-200"
              >
                <div className="mb-8 bg-slate-50 w-20 h-20 rounded-2xl flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section with enhanced design */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6"
            >
              Why Enterprises Choose Nexus
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100"
              >
                <div className="mb-8 bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  {benefit.title}
                </h3>
                <p className="text-lg text-slate-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 bg-gradient-to-r from-violet-900 via-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl sm:text-5xl font-bold text-white mb-12"
          >
            Ready to Modernize Your HR Operations?
          </motion.h2>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="inline-block"
          >
            <button className="group bg-gradient-to-r from-violet-400 to-blue-500 text-white px-12 py-6 rounded-2xl font-semibold text-xl hover:shadow-2xl transition-all duration-300">
              Start Free Trial
              <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>
      <Footer/>
    </div>
  );
};

export default LandingPage;