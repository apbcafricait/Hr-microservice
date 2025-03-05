import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLoginUserMutation } from '../../slices/UserApiSlice';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../../slices/AuthSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const [loginUser, { isLoading }] = useLoginUserMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRedirect = (role) => {
    if (!role) {
      console.error('Role is undefined or null');
      return;
    }
    switch (role.toLowerCase()) {
      case 'admin':
        navigate('/admin');
        break;
      case 'manager':
        navigate('/manager');
        break;
      case 'employee':
        navigate('/employee');
        break;
      default:
        console.error('Invalid role:', role);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      const response = await loginUser(formData).unwrap();
      dispatch(setCredentials(response));
      toast.success('Login successful!', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setTimeout(() => {
        handleRedirect(response.role);
      }, 1000);
    } catch (err) {
      toast.error(err.data?.message || 'Login failed. Please check your credentials.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
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
              repeatType: 'reverse',
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
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full bg-white/10 border ${
                  errors.email ? 'border-red-400' : 'border-white/20'
                } text-white rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password Input */}
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full bg-white/10 border ${
                  errors.password ? 'border-red-400' : 'border-white/20'
                } text-white rounded-lg pl-12 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                <span className="sr-only">
                  {showPassword ? 'Hide password' : 'Show password'}
                </span>
              </button>
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <a
                href="#"
                className="text-sm text-purple-300 hover:text-white transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg py-3 font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Logging in...
                </div>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          {/* Create Account Section */}
          <div className="mt-6 text-center">
            <span className="text-gray-300">Don't have an account? </span>
            <Link
              to="/register"
              className="text-purple-300 hover:text-white transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </motion.div>
      <ToastContainer />
    </div>
  );
};

export default Login;