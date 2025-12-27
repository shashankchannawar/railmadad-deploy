import React, { useState } from 'react';
import { Phone, Mail, MapPin, Search, Clock, CheckCircle, AlertTriangle, Loader, MessageCircle, FileText, Calendar, User } from 'lucide-react';
import Header from '../components/Header';
import Header from '../components/Header';
import Footer from '../components/Footer';
import API_BASE_URL from "../config";

const ContactUsPage = () => {
  const [mobile, setMobile] = useState('');
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = async () => {
    if (!mobile.trim()) {
      setError('Please enter a valid mobile number.');
      return;
    }

    if (!/^[0-9]{10}$/.test(mobile)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    setError('');
    setSearchPerformed(true);

    try {
      // Replace with your actual API endpoint
      const response = await fetch(`${API_BASE_URL}/api/admin-issues/by-mobile/${mobile}`);
      const data = await response.json();

      setComplaints(data);
      if (data.length === 0) {
        setError('No complaints found for this mobile number.');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong while fetching complaints. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'in progress':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'in progress':
        return <Loader className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Railway Helpline',
      details: '139',
      description: '24/7 customer support for all railway queries',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email Support',
      details: 'support@indianrail.gov.in',
      description: 'Send us your queries and complaints via email',
      color: 'bg-green-50 text-green-600'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Head Office',
      details: 'Railway Bhavan, New Delhi',
      description: 'Visit our head office for important matters',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: 'Live Chat',
      details: 'Available 24/7',
      description: 'Get instant help through our chatbot',
      color: 'bg-orange-50 text-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <Header />
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-2xl mb-6 max-w-6xl mx-auto">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <MessageCircle className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-green-100">We're here to help you with all your railway needs</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Complaint Checker Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <FileText className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Check Your Complaints</h2>
            <p className="text-gray-600">Enter your mobile number to view the status of your submitted complaints</p>
          </div>

          {/* Search Section */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Phone className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="tel"
                  placeholder="Enter your 10-digit mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  maxLength="10"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Search
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="max-w-md mx-auto mb-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Results Section */}
          {searchPerformed && !loading && complaints.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Found {complaints.length} complaint{complaints.length !== 1 ? 's' : ''} for mobile: {mobile}
              </h3>
              {complaints.map((complaint) => (
                <div
                  key={complaint._id}
                  className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold text-gray-700">Category:</span>
                        <span className="text-gray-600">{complaint.category || 'General'}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold text-gray-700">Date:</span>
                        <span className="text-gray-600">
                          {new Date(complaint.date).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>

                      <div className="flex items-start gap-2">
                        <MessageCircle className="w-4 h-4 text-gray-500 mt-0.5" />
                        <div>
                          <span className="font-semibold text-gray-700">Complaint:</span>
                          <p className="text-gray-600 mt-1">{complaint.complaintText}</p>
                        </div>
                      </div>
                    </div>

                    <div className="lg:ml-6">
                      <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full border font-medium ${getStatusColor(complaint.status)}`}>
                        {getStatusIcon(complaint.status)}
                        {complaint.status || 'Pending'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results Message */}
          {searchPerformed && !loading && complaints.length === 0 && !error && (
            <div className="text-center py-8">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No complaints found</h3>
              <p className="text-gray-500">No complaints were found for mobile number: {mobile}</p>
            </div>
          )}
        </div>

        {/* Contact Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((contact, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className={`w-12 h-12 rounded-full ${contact.color} flex items-center justify-center mb-4`}>
                {contact.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{contact.title}</h3>
              <p className="text-lg font-bold text-green-600 mb-2 break-words">{contact.details}</p>
              <p className="text-sm text-gray-600">{contact.description}</p>
            </div>
          ))}
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Office Hours */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-semibold text-gray-800">Office Hours</h3>
            </div>
            <div className="space-y-2 text-gray-600">
              <div className="flex justify-between">
                <span>Monday - Friday:</span>
                <span className="font-semibold">9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday:</span>
                <span className="font-semibold">9:00 AM - 2:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday:</span>
                <span className="font-semibold">Closed</span>
              </div>
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Emergency Helpline (139)</strong> is available 24/7 for urgent assistance
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <MessageCircle className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-semibold text-gray-800">Quick Actions</h3>
            </div>
            <div className="space-y-3">
              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" />
                Submit New Complaint
              </button>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Start Live Chat
              </button>
              <button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                <Phone className="w-4 h-4" />
                Call Helpline (139)
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactUsPage;