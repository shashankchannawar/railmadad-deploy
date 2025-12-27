import React, { useContext, useState } from 'react';
import { Train, Lock, Mail, AlertCircle, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import API_BASE_URL from "../config";



export default function SuperAdminLogin() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/admins/super-admin/login`, {
        email,
        password,
      });

      if (response.data.success) {
        // Use AuthContext login function
        const userData = {
          email: email,
          role: response.data.role, // 'super_admin'
        };
        login(response.data.token, userData);

        toast.success('✅ Login successful!', {
          duration: 3000, style: {
            background: '#fff',       // No background
            color: '#111827',                 // Dark text color (Tailwind gray-900)
            fontWeight: 'bold',
            borderRadius: '0.5rem',
            padding: '1rem',
            borderBottom: '4px solid #22c55e', // Greenish bottom border
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          },
        });


        navigate('/super-admin/dashboard');

      } else {
        setError(response.data.message || 'Login failed');
        toast.error(response.data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message || 'Something went wrong. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Government Header */}
      <div className="bg-white shadow-lg border-b-4 border-green-600">
        {/* Top Bar */}
        <div className="bg-green-800 text-white py-2">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <span>📞 Helpline: 139</span>
              <span className="hidden sm:inline">✉️ support@railmadad.gov.in</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-semibold">Secure Portal</span>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-green-600 p-3 rounded-lg flex items-center justify-center">
                <Train className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-green-800">Rail Madad</h1>
                <p className="text-sm text-gray-600">रेल मदद - Railway Grievance Portal</p>
              </div>
            </div>
          </div>
        </div>

        {/* Government Strip */}
        <div className="bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <span className="w-6 h-4 bg-orange-500 rounded-sm"></span>
              <span className="w-6 h-4 bg-white border rounded-sm"></span>
              <span className="w-6 h-4 bg-green-600 rounded-sm"></span>
              <span className="ml-2 text-xs sm:text-sm">Government of India | Ministry of Railways</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-white rounded-xl shadow-xl border-2 border-green-100">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-green-700 to-green-600 px-8 py-8 rounded-t-xl">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4 border-2 border-white/30">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Admin Login</h2>
              </div>
            </div>

            {/* Card Body */}
            <div className="px-8 py-8">
              <div className="space-y-6">
                {/* Error Alert */}
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                {/* Email Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition text-gray-900 bg-white"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition text-gray-900 bg-white"
                      placeholder="Enter your password"
                      onKeyPress={(e) => e.key === 'Enter' && handleLogin(e)}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3.5 px-4 rounded-lg font-bold text-base transition duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing In...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Lock className="w-5 h-5" />
                      Sign In Securely
                    </span>
                  )}
                </button>

                {/* Help Text */}
                <div className="text-center pt-2">
                  <p className="text-sm text-gray-600">
                    For assistance, contact:{' '}
                    <span className="text-green-600 font-semibold">support@railmadad.gov.in</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-md">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-yellow-800">Important Notice</p>
                <p className="text-xs text-yellow-700 mt-1">
                  This is a secure government portal. Unauthorized access is prohibited and will be prosecuted.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              © 2024 Ministry of Railways, Government of India. All Rights Reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span className="cursor-pointer hover:text-green-600 transition">Privacy Policy</span>
              <span className="cursor-pointer hover:text-green-600 transition">Terms of Service</span>
              <span className="cursor-pointer hover:text-green-600 transition">Help</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}