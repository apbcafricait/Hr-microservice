import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

const Contact = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    message: ''
  });

  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setResult('Sending...');

    const formSubmission = new FormData();
    formSubmission.append('access_key', '59f841df-79d1-4586-8993-080c023d201c');
    formSubmission.append('name', formData.name);
    formSubmission.append('email', formData.email);
    formSubmission.append('message', formData.message);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formSubmission
      });

      const data = await response.json();

      if (data.success) {
        setResult('Message sent successfully!');
        toast.success('Message sent successfully!', { position: 'top-center' });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setResult('Failed to send message. Please try again.');
        toast.error('Failed to send message. Please try again.', { position: 'top-center' });
      }
    } catch (error) {
      console.error('Error:', error);
      setResult('An error occurred. Please try again.');
      toast.error('An error occurred. Please try again.', { position: 'top-center' });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Header/>
      <div
        name="contact"
        className="w-full min-h-screen bg-gray-50 flex justify-center items-center p-4 pt-24"
      >
        <div className="w-full mx-auto flex flex-col lg:flex-row gap-8 px-4 lg:px-8">
          {/* Form Section - Made larger */}
          <div className="lg:w-2/3">
            <div className="pb-6">
              <p className="text-4xl font-bold inline border-b-4 border-indigo-600 text-gray-800">
                Contact
              </p>
              <p className="text-gray-600 py-4">Let's get in touch</p>
            </div>
            
            {/* Contact Details */}
            <div className="flex flex-row lg:flex-row gap-4 lg:gap-6 mb-6">
              {/* Email */}
              <div className="bg-white p-4 rounded-lg flex-1 shadow-md border">
                <h3 className="text-lg lg:text-xl font-semibold mb-2 text-gray-800">Email</h3>
                <a
                  href="mailto:apbcafricait@gmail.com"
                  className="text-indigo-600 hover:underline"
                >
                  apbcafricait@gmail.com
                </a>
              </div>
              {/* Phone */}
              <div className="bg-white p-4 rounded-lg flex-1 shadow-md border">
                <h3 className="text-lg lg:text-xl font-semibold mb-2 text-gray-800">Phone</h3>
                <a
                  href="tel:+254735277427"
                  className="text-indigo-600 hover:underline"
                >
                  +2547 3527 7427
                </a>
              </div>
            </div>

            {/* Contact Form - Changed to white background */}
            <form onSubmit={handleSubmit} className="bg-white p-6 lg:p-8 rounded-lg shadow-lg border">
              <h3 className="text-gray-800 text-xl font-semibold mb-4">Send Message</h3>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <label className="text-gray-700 block mb-2 font-medium">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full p-3 bg-gray-50 rounded-md text-gray-800 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition duration-300"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-gray-700 block mb-2 font-medium">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-3 bg-gray-50 rounded-md text-gray-800 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition duration-300"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-700 block mb-2 font-medium">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-50 rounded-md text-gray-800 h-24 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none resize-none transition duration-300"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={isSending}
                  className={`mt-4 px-8 py-3 rounded-md transition duration-300 font-semibold text-lg ${
                    isSending
                      ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 transform shadow-md'
                  }`}
                >
                  {isSending ? 'Sending...' : 'Send Message'}
                </button>
                {result && <span className="text-gray-600 mt-2 text-center block">{result}</span>}
              </div>
            </form>
          </div>

          {/* Map Section - Made smaller */}
          <div className="lg:w-1/3 bg-white p-4 rounded-lg shadow-lg flex flex-col border">
            <h3 className="text-gray-800 text-xl font-semibold mb-4">Our Location</h3>
            <div className="w-full flex-1 h-64 lg:h-80 rounded-lg overflow-hidden shadow-md">
              <iframe
                title="Nairobi Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d255281.19749860215!2d36.707429150000005!3d-1.2920659!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1172d84d49a7%3A0xf7cf0254b297924c!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2sus!4v1701234567890!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Toast container for notifications */}
        <ToastContainer />
      </div>
      <Footer/>
    </>
    
  );
};

export default Contact;