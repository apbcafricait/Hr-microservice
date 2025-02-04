import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      if (email === 'admin@hr.com' && password === 'password123') {
        // Handle successful login
        toast.success('Login successful!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        // Here you would normally redirect or update state
      } else {
        toast.error('Invalid credentials', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4 sm:p-8">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/5"
            style={{
              width: Math.random() * 300 + 50,
              height: Math.random() * 300 + 50,
            }}
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
            }}
            transition={{
              duration: Math.random() * 10 + 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md sm:max-w-lg relative"
      >
        <div className="backdrop-blur-xl bg-white/10 p-8 rounded-2xl shadow-2xl border border-white/20">
          <div className="text-center mb-8">
            <motion.h1 
              className="text-3xl sm:text-4xl font-bold text-white mb-2"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              HR System Login
            </motion.h1>
            <p className="text-gray-300">Welcome back! Please enter your details</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white rounded-lg pl-12 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <a href="#" className="text-sm text-purple-300 hover:text-white transition-colors">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg py-3 font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Logging in...
                </div>
              ) : (
                'Sign In'
              )}
            </motion.button>

            {/* Register Link */}
            <div className="text-center text-gray-300">
              Don't have an account?{' '}
              <a href="/register" className="text-purple-300 hover:text-white transition-colors">
                Register here
              </a>
            </div>
          </form>
        </div>
      </motion.div>
      <ToastContainer />
    </div>
  );
};

export default Login;