import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Coffee, 
  Laptop, 
  Heart, 
  TrendingUp,
  Award,
  Briefcase,
  GraduationCap,
  Globe,
  Send,
  ChevronRight
} from 'lucide-react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

const Careers = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('All');

  const jobOpenings = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Remote / Nairobi",
      type: "Full-time",
      salary: "$80,000 - $120,000",
      description: "Build beautiful, responsive user interfaces for our HR platform using React, TypeScript, and modern web technologies.",
      requirements: [
        "5+ years of React development experience",
        "TypeScript proficiency",
        "Experience with modern CSS frameworks",
        "Understanding of web accessibility standards"
      ]
    },
    {
      id: 2,
      title: "HR Product Manager",
      department: "Product",
      location: "Nairobi / Remote",
      type: "Full-time", 
      salary: "$90,000 - $130,000",
      description: "Drive product strategy and roadmap for our HR management features, working closely with customers and engineering teams.",
      requirements: [
        "3+ years in product management",
        "HR domain knowledge preferred",
        "Experience with B2B SaaS products",
        "Strong analytical and communication skills"
      ]
    },
    {
      id: 3,
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Nairobi",
      type: "Full-time",
      salary: "$60,000 - $80,000", 
      description: "Help our customers achieve success with Nexus HR, providing guidance, training, and ongoing support.",
      requirements: [
        "2+ years in customer success or account management",
        "Excellent communication skills",
        "Experience with SaaS platforms",
        "Problem-solving mindset"
      ]
    },
    {
      id: 4,
      title: "DevOps Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      salary: "$85,000 - $115,000",
      description: "Build and maintain our cloud infrastructure, ensuring scalability, security, and reliability of our platform.",
      requirements: [
        "3+ years DevOps experience",
        "AWS/Azure cloud experience",
        "Docker and Kubernetes knowledge",
        "Infrastructure as Code (Terraform)"
      ]
    },
    {
      id: 5,
      title: "UX Designer",
      department: "Design",
      location: "Nairobi / Remote",
      type: "Full-time",
      salary: "$70,000 - $95,000",
      description: "Design intuitive user experiences for our HR platform, conducting user research and creating wireframes and prototypes.",
      requirements: [
        "3+ years UX design experience",
        "Proficiency in Figma or similar tools",
        "User research experience",
        "Portfolio demonstrating B2B product design"
      ]
    },
    {
      id: 6,
      title: "Sales Development Representative",
      department: "Sales",
      location: "Nairobi",
      type: "Full-time",
      salary: "$45,000 - $65,000 + Commission",
      description: "Generate and qualify leads for our enterprise sales team, helping companies discover the value of Nexus HR.",
      requirements: [
        "1-2 years sales experience",
        "Strong communication skills",
        "CRM experience (Salesforce preferred)",
        "Self-motivated and goal-oriented"
      ]
    }
  ];

  const benefits = [
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Comprehensive health insurance, mental health support, and wellness programs"
    },
    {
      icon: Laptop,
      title: "Remote-First",
      description: "Work from anywhere with flexible hours and home office setup allowance"
    },
    {
      icon: GraduationCap,
      title: "Learning & Development",
      description: "Annual learning budget, conference attendance, and skill development programs"
    },
    {
      icon: Coffee,
      title: "Work-Life Balance",
      description: "Unlimited PTO, parental leave, and quarterly team retreats"
    },
    {
      icon: TrendingUp,
      title: "Equity & Growth",
      description: "Stock options, performance bonuses, and clear career progression paths"
    },
    {
      icon: Globe,
      title: "Global Team",
      description: "Work with talented people from around the world in an inclusive environment"
    }
  ];

  const departments = ['All', 'Engineering', 'Product', 'Design', 'Sales', 'Customer Success', 'Marketing'];

  const filteredJobs = selectedDepartment === 'All' 
    ? jobOpenings 
    : jobOpenings.filter(job => job.department === selectedDepartment);

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
              Join Our Team
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto mb-8"
            >
              Help us build the future of HR technology while working with amazing people 
              who are passionate about making work better for everyone.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-8 text-center"
            >
              <div>
                <div className="text-3xl font-bold">50+</div>
                <div className="text-blue-200">Team Members</div>
              </div>
              <div>
                <div className="text-3xl font-bold">15+</div>
                <div className="text-blue-200">Countries</div>
              </div>
              <div>
                <div className="text-3xl font-bold">4.9/5</div>
                <div className="text-blue-200">Employee Rating</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-center mb-16"
            >
              Why Work With Us?
            </motion.h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <Icon className="w-12 h-12 text-indigo-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Job Openings */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-center mb-12"
            >
              Open Positions
            </motion.h2>

            {/* Department Filter */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDepartment(dept)}
                  className={`px-6 py-3 rounded-full font-medium transition-colors duration-200 ${
                    selectedDepartment === dept
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>

            {/* Job Listings */}
            <div className="space-y-6">
              {filteredJobs.map((job) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        <h3 className="text-2xl font-bold text-gray-900">{job.title}</h3>
                        <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                          {job.department}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-6 mb-4 text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{job.type}</span>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-2" />
                          <span>{job.salary}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{job.description}</p>
                      
                      <div className="mb-6">
                        <h4 className="font-semibold mb-2">Key Requirements:</h4>
                        <ul className="space-y-1">
                          {job.requirements.map((req, index) => (
                            <li key={index} className="flex items-start">
                              <ChevronRight className="w-4 h-4 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-600">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="lg:ml-8">
                      <button className="w-full lg:w-auto bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center">
                        Apply Now
                        <Send className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No openings in this department</h3>
                <p className="text-gray-500">Check back soon or explore other departments!</p>
              </div>
            )}
          </div>
        </section>

        {/* Culture Section */}
        <section className="py-20 bg-gradient-to-r from-indigo-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold mb-6"
              >
                Our Culture
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-600 max-w-3xl mx-auto"
              >
                We believe in creating an environment where everyone can do their best work, 
                grow professionally, and make a meaningful impact.
              </motion.p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="text-center"
              >
                <Users className="w-16 h-16 text-indigo-600 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold mb-4">Collaborative</h3>
                <p className="text-gray-600">
                  We work together across teams and time zones, sharing knowledge 
                  and supporting each other to achieve common goals.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <Award className="w-16 h-16 text-purple-600 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold mb-4">Excellence</h3>
                <p className="text-gray-600">
                  We strive for excellence in everything we do, continuously 
                  improving our products, processes, and ourselves.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="text-center"
              >
                <Heart className="w-16 h-16 text-rose-600 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold mb-4">Inclusive</h3>
                <p className="text-gray-600">
                  We celebrate diversity and create an inclusive environment 
                  where everyone feels valued and empowered to contribute.
                </p>
              </motion.div>
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
              Ready to Make an Impact?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl mb-8 max-w-2xl mx-auto"
            >
              Don't see the perfect role? We're always looking for talented people to join our team. 
              Send us your resume and let's talk!
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center"
            >
              <button className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
                Send Resume
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors duration-200">
                Learn More
              </button>
            </motion.div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default Careers;