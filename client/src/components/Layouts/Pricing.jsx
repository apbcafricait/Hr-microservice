import { motion } from 'framer-motion';
import { Check, Star, Zap, Crown } from 'lucide-react';
import Header from './Header.jsx';
const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      icon: Zap,
      price: "$5",
      period: "per employee/month",
      features: [
        "Employee Management",
        "Basic Leave Management", 
        "Time Tracking",
        "Email Support"
      ]
    },
    {
      name: "Professional", 
      icon: Star,
      price: "$12",
      period: "per employee/month",
      popular: true,
      features: [
        "Everything in Starter",
        "Payroll Processing",
        "Advanced Analytics",
        "Priority Support",
        "API Access"
      ]
    },
    {
      name: "Enterprise",
      icon: Crown,
      price: "Custom",
      period: "contact sales",
      features: [
        "Everything in Professional",
        "Custom Integrations",
        "Dedicated Support",
        "Advanced Security",
        "On-premise Option"
      ]
    }
  ];

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
          Simple, Transparent Pricing
        </motion.h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white p-8 rounded-2xl shadow-lg text-center ${
                  plan.popular ? 'ring-2 ring-purple-500' : ''
                }`}
              >
                {plan.popular && (
                  <div className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm mb-4 inline-block">
                    Most Popular
                  </div>
                )}
                
                <Icon className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-purple-600 mb-2">{plan.price}</div>
                <p className="text-gray-500 mb-8">{plan.period}</p>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button className={`w-full py-3 px-6 rounded-lg font-semibold ${
                  plan.popular 
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}>
                  {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
    </>
  );
};

export default Pricing;