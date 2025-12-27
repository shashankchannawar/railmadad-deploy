import React, { useState } from 'react';
import { Phone, FileText, Calendar, Upload, X, CheckCircle, Send, AlertTriangle, ArrowLeft } from 'lucide-react';
import Header from '../components/Header';

import Footer from '../components/Footer';
import API_BASE_URL from "../config";

const ComplaintSubmissionPage = () => {
  const [formData, setFormData] = useState({
    mobile: '',
    email: '',
    pnr: '',
    date: '',
    complaintText: '',
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [complaintId, setComplaintId] = useState('');

  const validateForm = () => {
    const newErrors = {};

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^[0-9]{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile number must be 10 digits';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.pnr.trim()) {
      newErrors.pnr = 'PNR number is required';
    } else if (!/^[0-9A-Z]{10}$/.test(formData.pnr.toUpperCase())) {
      newErrors.pnr = 'PNR number must be 10 characters (letters/numbers)';
    }

    if (!formData.date) newErrors.date = 'Date of incident is required';
    if (!formData.complaintText.trim()) newErrors.complaintText = 'Complaint details are required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image') {
      const file = files[0];
      if (file) {
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          alert('File size must be less than 5MB');
          return;
        }
        if (!file.type.startsWith('image/')) {
          alert('Please select a valid image file');
          return;
        }
      }
      setFormData({ ...formData, image: file || null });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image: null });
    // Reset file input
    const fileInput = document.getElementById('image-upload');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    const data = new FormData();
    data.append('mobile', formData.mobile);
    data.append('email', formData.email);
    data.append('pnr', formData.pnr.toUpperCase());
    data.append('date', formData.date);
    data.append('complaintText', formData.complaintText);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/complaints`, {
        method: 'POST',
        body: data,
      });

      // Backend should return a JSON (maybe with message or complaintId)
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit complaint');
      }

      console.log('✅ Complaint submitted:', result);

      // If your backend returns a complaint ID, use it:
      const id = result.complaintId || `CMP-${Date.now().toString().slice(-6)}`;
      setComplaintId(id);
      setIsSubmitted(true);

      // Reset form
      setFormData({
        mobile: '',
        email: '',
        pnr: '',
        date: '',
        complaintText: '',
        image: null,
      });

      const fileInput = document.getElementById('image-upload');
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error('❌ Error submitting complaint:', error);
      alert(error.message || 'Failed to submit complaint. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setComplaintId('');
    setErrors({});
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <button
            onClick={resetForm}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Complaint Submitted Successfully!</h2>
            <p className="text-gray-600">Your complaint has been received and assigned ID:</p>
            <p className="text-xl font-semibold text-green-600 mt-2">{complaintId}</p>
          </div>

          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-800">
              Your complaint has been instantly processed and forwarded to the concerned department for immediate action.
              Track your complaint status anytime using your complaint ID or Mobile number.
            </p>
          </div>

          <button
            onClick={resetForm}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold transition-colors w-full"
          >
            Submit Another Complaint
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 ">
      <Header />
      <div className="max-w-2xl mx-auto mb-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-2xl mb-6">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Submit Your Complaint</h1>
            <p className="text-green-100">We take your concerns seriously. Please provide detailed information to help us resolve your issue.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Mobile Number */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number *</label>
            <div className="relative">
              <Phone className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 ${errors.mobile ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter your 10-digit mobile number"
                maxLength="10"
              />
            </div>
            {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter your email address"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* PNR Number */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">PNR Number *</label>
            <div className="relative">
              <FileText className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                name="pnr"
                value={formData.pnr}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 uppercase ${errors.pnr ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter your PNR number"
                maxLength="10"
              />
            </div>
            {errors.pnr && <p className="text-red-500 text-sm mt-1">{errors.pnr}</p>}
            <p className="text-xs text-gray-500 mt-1">10-character alphanumeric code</p>
          </div>

          {/* Date of Incident */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Incident *</label>
            <div className="relative">
              <Calendar className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
          </div>

          {/* Complaint Details */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Complaint Details *</label>
            <textarea
              name="complaintText"
              value={formData.complaintText}
              onChange={handleChange}
              rows={5}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 ${errors.complaintText ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Please provide detailed information about your complaint, including what happened, when, and any relevant circumstances..."
            />
            {errors.complaintText && <p className="text-red-500 text-sm mt-1">{errors.complaintText}</p>}
            <p className="text-sm text-gray-500 mt-1">{formData.complaintText.length}/1000 characters</p>
          </div>

          {/* Image Upload */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Supporting Image (Optional)</label>

            {!formData.image ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">Click to upload an image</p>
                <p className="text-sm text-gray-500 mb-4">JPG, PNG, GIF up to 5MB</p>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors inline-block"
                >
                  Choose Image
                </label>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <FileText className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">{formData.image.name}</p>
                      <p className="text-xs text-gray-500">
                        {(formData.image.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Submitting Complaint...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Submit Complaint
                </>
              )}
            </button>
            <p className="text-sm text-gray-500 mt-4">
              By submitting this form, you agree that we may contact you regarding your complaint.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ComplaintSubmissionPage;