import React, { useState } from 'react';
import { motion } from 'framer-motion';
import EmployeeProgress from './EmployeeProgress';
import PerformanceDashboard from './PerformanceDashboard';
import PerformanceReviews from './PerformanceReviews';
import ReviewHistory from './ReviewHistory';
import SelfAssessment from './SelfAssessment';
import GoalSetting from './GoalSetting';
import PerformanceMetrics from './PerformanceMetrics';
import Feedback from './Feedback';
import ManagerAssessment from './ManagerAssessment';

const PerformanceEntry = () => {
  const [activeComponent, setActiveComponent] = useState('PerformanceReviews');

  const renderComponent = () => {
    switch (activeComponent) {
      case 'GoalSetting':
        return <GoalSetting />;
      case 'PerformanceMetrics':
        return <PerformanceMetrics />;
      case 'Feedback':
        return <Feedback />;
      case 'EmployeeProgress':
        return <EmployeeProgress />;
      case 'PerformanceDashboard':
        return <PerformanceDashboard />;
      case 'ReviewHistory':
        return <ReviewHistory />;
      case 'SelfAssessment':
        return <SelfAssessment />;
      case 'ManagerAssessment':
        return <ManagerAssessment />;
      default:
        return <div className="text-white">Performance Reviews content will be added here...</div>;
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex flex-col">
      {/* Header */}
      <h2 className="text-lg font-bold text-white text-center mb-4">
        Performance Management
      </h2>

      {/* Button Row */}
      <div className="flex justify-center space-x-4 mb-4">
        {['PerformanceReviews', 'GoalSetting', 'PerformanceMetrics', 'Feedback', 
          'EmployeeProgress', 'PerformanceDashboard', 'ReviewHistory', 
          'SelfAssessment', 'ManagerAssessment'].map((component) => (
          <motion.button 
            key={component}
            className={`text-white text-sm py-2 px-4 rounded-lg transition-all duration-300 ease-in-out 
              hover:bg-white/20 hover:scale-105 ${activeComponent === component ? 'bg-white/20' : ''}`}
            onClick={() => setActiveComponent(component)}
            whileHover={{ scale: 1.05 }}
          >
            {component.replace(/([A-Z])/g, ' $1').trim()}
          </motion.button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4">
        <div className="backdrop-blur-xl bg-white/10 rounded-xl p-6 shadow-lg border border-white/20">
          {renderComponent()}
        </div>
      </div>
    </div>
  );
};

export default PerformanceEntry;
