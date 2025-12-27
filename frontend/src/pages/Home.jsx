import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import ChatbotPopup from '../components/Chatbot';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from "react-router-dom";

const HeroSection = ({ onLodgeClick, onTrackClick }) => {
  return (
    <section className="relative bg-gradient-to-br from-green-50 to-green-100 py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center bg-green-100 border border-green-200 rounded-full px-4 py-2">
              <span className="text-green-800 text-sm font-medium">🛡️ Trusted by Millions of Passengers</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Welcome to
                <span className="block text-green-600 mt-2">Rail Madad</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Your trusted platform for railway grievance redressal. Submit complaints, track status, and get swift resolution with our AI-powered system.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-3"></div>
                <p className="text-gray-700">Submit complaints using PNR number for instant tracking</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-3"></div>
                <p className="text-gray-700">AI-powered categorization for faster resolution</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-3"></div>
                <p className="text-gray-700">Real-time SMS and email updates on complaint status</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onLodgeClick}
                
                className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Lodge Complaint →
              </button>
              <button
               onClick={onTrackClick}
               className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-green-600 hover:text-white transition-all">
                Track Existing Complaint
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white p-6 rounded-2xl shadow-2xl border border-gray-200">
              <img
                src="/landing.jpg"
                alt="Railway services illustration"
                className="w-full h-80 object-cover rounded-xl"
              />
              <div className="absolute -top-4 -right-4 bg-white p-4 rounded-xl shadow-lg border">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Live Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: "50L+", label: "Citizens Served" },
            { number: "98%", label: "Resolution Rate" },
            { number: "24x7", label: "Support Available" },
            { number: "2min", label: "Avg Response Time" }
          ].map((stat, index) => (
            <div key={index} className="text-center bg-white p-6 rounded-xl shadow-lg">
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: "🚂",
      title: "PNR-Based Complaint Filing",
      description: "File complaints directly using your PNR number for accurate journey identification and faster processing"
    },
    {
      icon: "⚡",
      title: "AI-Powered Smart Categorization",
      description: "Advanced AI system automatically categorizes and prioritizes complaints for optimal resolution workflow"
    },
    {
      icon: "⏰",
      title: "Real-Time Status Updates",
      description: "Get instant notifications via SMS and email about your complaint progress and resolution status"
    },
    {
      icon: "🛡️",
      title: "Secure & Confidential",
      description: "Government-grade security ensures your personal information and complaints remain protected"
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Why Choose <span className="text-green-600">Rail Madad</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience next-generation railway grievance redressal with cutting-edge technology
            and dedicated support from the Ministry of Railways
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-50 p-8 rounded-2xl border hover:border-green-300 hover:shadow-lg transition-all">
              <div className="flex items-start space-x-4">
                <div className="text-4xl">{feature.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h3>
            <p className="text-gray-600">Simple 4-step process to resolve your railway complaints</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Submit Complaint", desc: "Enter PNR & complaint details" },
              { step: "02", title: "AI Processing", desc: "Smart categorization & priority" },
              { step: "03", title: "Department Review", desc: "Relevant authority processes" },
              { step: "04", title: "Resolution", desc: "Get notification of resolution" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="bg-green-600 w-24 h-24 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const CTASection = ({ onLodgeClick  }) => {
  return (
    <section className="py-20 bg-gradient-to-br from-green-600 to-green-800 relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Get Your Railway Issues Resolved?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
            Join millions of satisfied passengers who trust Rail Madad for quick,
            efficient, and transparent complaint resolution
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onLodgeClick }
              className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Start Your Complaint →
            </button>
            {/* <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-all">
              <a href="#about">Learn More About Services</a>
            </button> */}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {[
            { number: "50L+", label: "Complaints Resolved" },
            { number: "98%", label: "Success Rate" },
            { number: "24x7", label: "Support Available" },
            { number: "2min", label: "Avg Response Time" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-green-100 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center bg-green-700/30 backdrop-blur-sm rounded-xl p-6 border border-green-500/30">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="w-4 h-3 bg-orange-500 rounded-sm"></span>
            <span className="w-4 h-3 bg-white rounded-sm"></span>
            <span className="w-4 h-3 bg-green-400 rounded-sm"></span>
          </div>
          <p className="text-green-100 text-sm">
            <strong className="text-white">Government of India</strong> • Ministry of Railways •
            Secure & Confidential Platform
          </p>
        </div>
      </div>
    </section>
  );
};



// Main Home Component
const Home = () => {
  const navigate = useNavigate();
  const handleLodgeClick = () => navigate("/complaint");
  const handleTrackClick = () => navigate("/contact");
  // const handleButtonClick = () => {
  //   // navigate('/complaint'); // Uncomment when router is available
  //   console.log('Navigating to complaint page...');
  // };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection onLodgeClick={handleLodgeClick}
        onTrackClick={handleTrackClick} />
      <FeaturesSection />
      <CTASection  onLodgeClick={handleLodgeClick}/>
      <Footer />

      {/* Floating Chat Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <ChatbotPopup />
      </div>
    </div>
  );
};

export default Home;