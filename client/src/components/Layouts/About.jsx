import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Eye, 
  Heart, 
  Users, 
  Award, 
  TrendingUp, 
  Globe, 
  Zap,
  CheckCircle,
  Clock,
  Shield,
  Lightbulb
} from 'lucide-react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

const About = () => {
  const stats = [
    { number: "10,000+", label: "Companies Trust Us", icon: Users },
    { number: "500K+", label: "Employees Managed", icon: TrendingUp },
    { number: "99.9%", label: "System Uptime", icon: Shield },
    { number: "24/7", label: "Customer Support", icon: Clock }
  ];

  const values = [
    {
      icon: Heart,
      title: "People First",
      description: "We believe that great HR technology should empower people, not replace them. Every feature we build puts human experience at the center."
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description: "Your data is sacred to us. We implement enterprise-grade security measures and maintain the highest standards of data privacy."
    },
    {
      icon: Lightbulb,
      title: "Continuous Innovation",
      description: "We're constantly evolving our platform based on user feedback and emerging HR trends to stay ahead of industry needs."
    },
    {
      icon: Globe,
      title: "Global Accessibility",
      description: "Our platform is designed to serve organizations worldwide, with multi-language support and compliance with international standards."
    }
  ];

  const timeline = [
    {
      year: "2019",
      title: "The Vision Born",
      description: "Founded with a mission to transform HR management for modern businesses"
    },
    {
      year: "2020",
      title: "First 1,000 Users",
      description: "Reached our first milestone of helping 1,000 employees across 50 companies"
    },
    {
      year: "2022",
      title: "AI Integration",
      description: "Launched AI-powered analytics and predictive workforce insights"
    },
    {
      year: "2024",
      title: "Global Expansion",
      description: "Now serving 10,000+ companies across 45 countries worldwide"
    }
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Co-Founder",
      bio: "Former HR Director with 15+ years experience transforming workplace culture"
    },
    {
      name: "Michael Chen",
      role: "CTO & Co-Founder", 
      bio: "Tech visionary specializing in scalable SaaS solutions and AI integration"
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Product",
      bio: "UX expert passionate about creating intuitive, human-centered software experiences"
    },
    {
      name: "David Kim",
      role: "VP of Engineering",
      bio: "Full-stack architect ensuring platform security, performance, and reliability"
    }
  ];

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="pt-24 pb-16 bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-bold mb-6"
            >
              About Nexus HR
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto mb-8"
            >
              Empowering organizations worldwide with intelligent HR management solutions 
              that put people first and drive business success.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-6"
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Icon className="w-6 h-6 mr-2 text-blue-300" />
                      <span className="text-3xl font-bold">{stat.number}</span>
                    </div>
                    <p className="text-blue-200">{stat.label}</p>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-16">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="text-center"
              >
                <Target className="w-16 h-16 text-indigo-600 mx-auto mb-6" />
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  To revolutionize human resources management by providing intuitive, 
                  powerful, and accessible tools that enable organizations to unlock 
                  their people's full potential while streamlining HR operations.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="text-center"
              >
                <Eye className="w-16 h-16 text-purple-600 mx-auto mb-6" />
                <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  To become the world's most trusted HR platform, where every 
                  organization can create exceptional workplace experiences that 
                  drive employee engagement, retention, and business growth.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-center mb-16"
            >
              Our Values
            </motion.h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center p-6 rounded-xl bg-gray-50 hover:shadow-lg transition-shadow duration-300"
                  >
                    <Icon className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-center mb-16"
            >
              Our Journey
            </motion.h2>
            
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className={`flex flex-col md:flex-row items-center gap-8 ${
                    index % 2 === 1 ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  <div className="md:w-1/2">
                    <div className="bg-white p-8 rounded-2xl shadow-lg">
                      <span className="text-2xl font-bold text-indigo-600">{item.year}</span>
                      <h3 className="text-2xl font-semibold mt-2 mb-4">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  <div className="md:w-1/2 flex justify-center">
                    <div className="w-4 h-4 bg-indigo-600 rounded-full"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-center mb-16"
            >
              Meet Our Leadership
            </motion.h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-32 h-32 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-16 h-16 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-indigo-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold mb-6"
            >
              Ready to Transform Your HR?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl mb-8 max-w-2xl mx-auto"
            >
              Join thousands of companies that trust Nexus HR to manage their most valuable asset - their people.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center"
            >
              <button className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
                Start Free Trial
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors duration-200">
                Schedule Demo
              </button>
            </motion.div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default About;