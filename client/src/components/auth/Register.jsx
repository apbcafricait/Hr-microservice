import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRegisterUserMutation } from '../../slices/UserApiSlice';
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../slices/AuthSlice'

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  
  // Using the mutation hook from UserApiSlice
  const [registerUser, { isLoading: isRegistering, error: registerError }] = useRegisterUserMutation();

  useEffect(() => {
    if (registerError) {
      if ('data' in registerError) {
        toast.error(registerError.data?.message || 'Registration failed');
      } else {
        toast.error('Registration failed. Please try again later.');
      }
    }
  }, [registerError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please correct the form errors.');
      return;
    }

    try {
      setIsLoading(true);
      const { confirmPassword, ...registrationData } = formData;
      
      const response = await registerUser(registrationData).unwrap();
      
      // Store user data in Redux
      dispatch(setCredentials({ 
        user: response.user, 
        token: response.token 
      }));

      toast.success('Registration successful!');
      
      // Clear form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

      // Redirect to dashboard or home page
      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (err) {
      const message = err.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
      
      if (err.data?.errors) {
        setErrors(err.data.errors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };


  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      <ToastContainer />
      {/* Animated Background Circles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/5"
          animate={{
            x: [0, Math.random() * 400 - 200],
            y: [0, Math.random() * 400 - 200],
            scale: [1, Math.random() * 2 + 0.5],
          }}
          transition={{
            duration: Math.random() * 10 + 5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{
            width: Math.random() * 100 + 50,
            height: Math.random() * 100 + 50,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {/* Registration Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md sm:max-w-lg backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-2xl relative z-10"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 text-center">Create Account</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-purple-300" />
            </div>
            <input
              type="text"
              className={`w-full pl-10 pr-4 py-3 bg-white/5 border ${errors.name ? 'border-red-400' : 'border-purple-400'} rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            {errors.name && <p className="mt-1 text-red-400 text-sm">{errors.name}</p>}
          </div>

          {/* Email Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-purple-300" />
            </div>
            <input
              type="email"
              className={`w-full pl-10 pr-4 py-3 bg-white/5 border ${errors.email ? 'border-red-400' : 'border-purple-400'} rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            {errors.email && <p className="mt-1 text-red-400 text-sm">{errors.email}</p>}
          </div>

          {/* Password Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-purple-300" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              className={`w-full pl-10 pr-12 py-3 bg-white/5 border ${errors.password ? 'border-red-400' : 'border-purple-400'} rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-purple-300" />
              ) : (
                <Eye className="h-5 w-5 text-purple-300" />
              )}
            </button>
            {errors.password && <p className="mt-1 text-red-400 text-sm">{errors.password}</p>}
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-purple-300" />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              className={`w-full pl-10 pr-12 py-3 bg-white/5 border ${errors.confirmPassword ? 'border-red-400' : 'border-purple-400'} rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-purple-300" />
              ) : (
                <Eye className="h-5 w-5 text-purple-300" />
              )}
            </button>
            {errors.confirmPassword && <p className="mt-1 text-red-400 text-sm">{errors.confirmPassword}</p>}
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-semibold shadow-lg hover:opacity-90 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              </div>
            ) : (
              'Create Account'
            )}
          </motion.button>

          {/* Login Link */}
          <p className="text-center text-white mt-6">
            Already have an account?{' '}
            <a href="/login" className="text-purple-300 hover:text-purple-200 font-semibold">
              Login here
            </a>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;