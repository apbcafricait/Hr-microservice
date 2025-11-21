import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, DollarSign, Users, BarChart3, ChevronDown, ChevronUp } from 'lucide-react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
const Benefits = () => {
  const [expandedCard, setExpandedCard] = useState(null);

  const benefits = [
    {
      icon: TrendingUp,
      title: "85% Efficiency Increase",
      description: "Dramatically reduce manual HR tasks and boost productivity",
      metric: "Save 20+ hours per week",
      detailedInfo: {
        howItWorks: "Our AI-powered automation eliminates repetitive tasks and streamlines workflows",
        features: [
          "Automated employee onboarding reduces setup time from 3 days to 2 hours",
          "Smart leave approval workflows eliminate back-and-forth emails",
          "Bulk payroll processing handles 1000+ employees in minutes",
          "Self-service employee portal reduces HR inquiries by 75%",
          "Automated compliance reporting saves 15 hours monthly"
        ],
        realWorldImpact: "Companies using our system report their HR teams can focus on strategic initiatives instead of paperwork, leading to better employee engagement and business outcomes."
      }
    },
    {
      icon: DollarSign, 
      title: "60% Cost Reduction",
      description: "Lower operational costs through automation",
      metric: "$15,000 annual savings",
      detailedInfo: {
        howItWorks: "Smart automation and process optimization eliminate costly manual operations",
        features: [
          "Reduce HR staff workload by 40% through automation",
          "Eliminate paper-based processes saving $25,000 annually on printing/storage",
          "Prevent payroll errors that cost companies an average of $78,000 yearly",
          "Automated compliance reduces legal risk and potential fines",
          "Cloud-based system eliminates expensive on-premise infrastructure"
        ],
        realWorldImpact: "Mid-size companies typically see ROI within 6 months, with total cost savings reaching $150,000+ annually through reduced overhead and increased efficiency."
      }
    },
    {
      icon: Users,
      title: "Enhanced Employee Experience", 
      description: "Improve satisfaction with self-service tools",
      metric: "94% satisfaction rate",
      detailedInfo: {
        howItWorks: "Modern, intuitive interfaces and self-service capabilities empower employees",
        features: [
          "Mobile-first design allows employees to access HR services anywhere",
          "Real-time leave balance tracking and instant approval notifications",
          "Digital document access eliminates waiting for HR responses",
          "Transparent performance tracking and goal management",
          "24/7 access to payslips, benefits info, and company policies"
        ],
        realWorldImpact: "Employee surveys show 94% satisfaction with our platform, leading to 40% reduction in turnover and 35% increase in employee engagement scores."
      }
    },
    {
      icon: BarChart3,
      title: "Data-Driven Decisions",
      description: "Make informed choices with real-time analytics",
      metric: "3x faster decisions",
      detailedInfo: {
        howItWorks: "Advanced analytics and AI-powered insights transform raw HR data into actionable intelligence",
        features: [
          "Real-time dashboards show key HR metrics at a glance",
          "Predictive analytics identify employees at risk of leaving",
          "Performance trends help identify top performers and training needs",
          "Compensation analysis ensures competitive and fair pay structures",
          "Custom reports provide deep insights into workforce patterns"
        ],
        realWorldImpact: "HR leaders make strategic decisions 3x faster with instant access to data insights, leading to proactive talent management and improved business outcomes."
      }
    }
  ];

  const toggleExpand = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  return (
    <>
      <Header/>
      
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-center mb-16"
          >
            HR Benefits & ROI (Return On Investment)
          </motion.h1>
          
          <div className="grid md:grid-cols-2 gap-12">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              const isExpanded = expandedCard === index;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-8 rounded-2xl shadow-lg"
                >
                  <Icon className="w-16 h-16 text-green-600 mb-6" />
                  <h3 className="text-2xl font-bold mb-4">{benefit.title}</h3>
                  <p className="text-gray-600 mb-6">{benefit.description}</p>
                  <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg font-semibold mb-6">
                    {benefit.metric}
                  </div>

                  {/* Read More/Less Button */}
                  <button
                    onClick={() => toggleExpand(index)}
                    className="flex items-center justify-center w-full py-3 px-4 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-medium transition-colors duration-200"
                  >
                    {isExpanded ? (
                      <>
                        <span>Show Less</span>
                        <ChevronUp className="w-5 h-5 ml-2" />
                      </>
                    ) : (
                      <>
                        <span>See How This Works</span>
                        <ChevronDown className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </button>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-6 p-6 bg-gray-50 rounded-lg">
                          {/* How It Works */}
                          <div className="mb-6">
                            <h4 className="text-lg font-semibold text-gray-800 mb-3">
                              How Our System Achieves This:
                            </h4>
                            <p className="text-gray-600 leading-relaxed">
                              {benefit.detailedInfo.howItWorks}
                            </p>
                          </div>

                          {/* Key Features */}
                          <div className="mb-6">
                            <h4 className="text-lg font-semibold text-gray-800 mb-3">
                              Key Features:
                            </h4>
                            <ul className="space-y-2">
                              {benefit.detailedInfo.features.map((feature, idx) => (
                                <li key={idx} className="flex items-start">
                                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                  <span className="text-gray-600">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Real World Impact */}
                          <div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-3">
                              Real-World Impact:
                            </h4>
                            <p className="text-gray-600 leading-relaxed bg-white p-4 rounded-lg border-l-4 border-green-500">
                              {benefit.detailedInfo.realWorldImpact}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
        <Footer/>
    </>
  );
};

export default Benefits;