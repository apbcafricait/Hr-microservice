import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Calendar, DollarSign, BarChart3, FileText, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

const Features = () => {
  const [expandedCard, setExpandedCard] = useState(null);

  const features = [
    {
      icon: Users,
      title: "Employee Management System",
      description: "Complete employee lifecycle management with profiles, org charts, and onboarding.",
      details: [
        "360° Employee profiles with documents",
        "Interactive organizational charts", 
        "Automated onboarding workflows",
        "Skills and competency tracking",
        "Custom role-specific fields"
      ],
      detailedInfo: {
        howItWorks: "Our comprehensive employee management system centralizes all workforce data in a secure, intuitive platform that grows with your organization.",
        features: [
          "Digital employee profiles with photo, personal info, job history, and document storage",
          "Visual organizational chart builder with drag-and-drop functionality",
          "Automated onboarding checklist with task assignments and progress tracking",
          "Skills matrix and competency framework for career development",
          "Custom fields for industry-specific information (certifications, licenses, etc.)",
          "Employee directory with advanced search and filtering options"
        ],
        realWorldImpact: "Companies using our employee management system reduce onboarding time by 70% and eliminate 95% of paper-based HR processes, while improving data accuracy and employee satisfaction."
      }
    },
    {
      icon: Calendar,
      title: "Leave Management",
      description: "Smart leave planning with automated approvals and analytics.",
      details: [
        "Multi-level approval workflows",
        "Leave balance forecasting",
        "Holiday calendar integration", 
        "Emergency leave handling",
        "Carry-forward rules"
      ],
      detailedInfo: {
        howItWorks: "AI-powered leave management system that automates approval workflows, tracks balances in real-time, and provides predictive analytics for better workforce planning.",
        features: [
          "Configurable multi-step approval workflows with automatic escalation",
          "Real-time leave balance tracking with automated accrual calculations",
          "Company-wide holiday calendar with regional and department variations",
          "Emergency leave protocols with immediate notification systems",
          "Flexible carry-forward rules and leave encashment policies",
          "Mobile leave requests with GPS verification for remote workers"
        ],
        realWorldImpact: "Organizations report 85% reduction in leave management administrative time, 40% decrease in scheduling conflicts, and 90% employee satisfaction with the leave request process."
      }
    },
    {
      icon: DollarSign,
      title: "Payroll Processing",
      description: "Automated payroll with tax calculations and compliance.",
      details: [
        "Automated tax calculations",
        "Multi-currency support",
        "Overtime calculations",
        "Direct bank transfers",
        "Payslip generation"
      ],
      detailedInfo: {
        howItWorks: "Advanced payroll engine that handles complex calculations, ensures compliance, and integrates with banking systems for seamless salary disbursement.",
        features: [
          "Automated federal, state, and local tax calculations with real-time updates",
          "Multi-currency payroll processing for global organizations",
          "Smart overtime calculation based on labor laws and company policies",
          "Direct deposit with multiple bank account support per employee",
          "Digital payslip generation with secure employee access portal",
          "Integration with accounting systems and expense management tools"
        ],
        realWorldImpact: "Payroll processing time reduced by 80%, payroll errors decreased by 95%, and compliance accuracy improved to 99.9% with automatic regulatory updates."
      }
    },
    {
      icon: BarChart3,
      title: "HR Analytics & Reporting",
      description: "Data-driven insights for strategic HR decision making.",
      details: [
        "Real-time dashboard metrics",
        "Custom report builder",
        "Predictive analytics",
        "Performance insights",
        "Compliance tracking"
      ],
      detailedInfo: {
        howItWorks: "Powerful analytics engine that transforms HR data into actionable insights using machine learning and predictive modeling for strategic workforce planning.",
        features: [
          "Real-time executive dashboards with key HR KPIs and metrics",
          "Drag-and-drop custom report builder with 50+ data points",
          "Predictive analytics for turnover risk and succession planning",
          "Performance trend analysis and goal tracking insights",
          "Automated compliance reporting with audit trail capabilities",
          "Benchmarking tools comparing your metrics against industry standards"
        ],
        realWorldImpact: "HR teams make data-driven decisions 3x faster, reduce turnover by 35% through predictive insights, and save 15 hours weekly on manual reporting tasks."
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
            HR System Features
          </motion.h1>
          
          <div className="space-y-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isExpanded = expandedCard === index;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <div className="grid md:grid-cols-2 gap-12 items-center p-8">
                    <div>
                      <div className="flex items-center mb-6">
                        <Icon className="w-12 h-12 text-indigo-600 mr-4" />
                        <h2 className="text-3xl font-bold">{feature.title}</h2>
                      </div>
                      <p className="text-xl text-gray-600 mb-8">{feature.description}</p>
                      <ul className="space-y-3">
                        {feature.details.map((detail, idx) => (
                          <li key={idx} className="flex items-center">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full mr-4"></div>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-indigo-100 rounded-2xl p-8 h-80 flex items-center justify-center">
                      <Icon className="w-32 h-32 text-indigo-600" />
                    </div>
                  </div>

                  {/* Read More/Less Button */}
                  <div className="px-8 pb-6">
                    <button
                      onClick={() => toggleExpand(index)}
                      className="flex items-center justify-center w-full py-3 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg font-medium transition-colors duration-200"
                    >
                      {isExpanded ? (
                        <>
                          <span>Show Less Details</span>
                          <ChevronUp className="w-5 h-5 ml-2" />
                        </>
                      ) : (
                        <>
                          <span>See How This Works</span>
                          <ChevronDown className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </button>
                  </div>

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
                        <div className="px-8 pb-8">
                          <div className="p-6 bg-gray-50 rounded-lg">
                            {/* How It Works */}
                            <div className="mb-6">
                              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                                How This Feature Works:
                              </h4>
                              <p className="text-gray-600 leading-relaxed">
                                {feature.detailedInfo.howItWorks}
                              </p>
                            </div>

                            {/* Detailed Features */}
                            <div className="mb-6">
                              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                                Complete Feature Set:
                              </h4>
                              <ul className="space-y-2">
                                {feature.detailedInfo.features.map((detailFeature, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                    <span className="text-gray-600">{detailFeature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Real World Impact */}
                            <div>
                              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                                Real-World Results:
                              </h4>
                              <p className="text-gray-600 leading-relaxed bg-white p-4 rounded-lg border-l-4 border-indigo-500">
                                {feature.detailedInfo.realWorldImpact}
                              </p>
                            </div>
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

export default Features;