import React from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate(); // Initialize navigate function

  const handleButtonClick = () => {
    navigate('/complaint'); // Redirect to the '/complaint' route when button is clicked
  };
  return (
    <div className="bg-slate-800 min-h-screen">
      {/* Header Component */}
      <Header />

      {/* Landing Page Content */}
      <div className="grid lg:grid-cols-2 gap-8 items-center px-10 py-20">
        {/* Image Section */}
        <div className="flex justify-center">
          <img
            src="/landing.jpg"
            alt="Railway services illustration"
            className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-xl shadow-2xl object-cover"
          />
        </div>

        {/* Text Section */}
        <div className="text-white space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold">
            Welcome to <span className="text-yellow-400">Rail Madad</span>
          </h1>
          <p className="text-lg md:text-xl leading-relaxed">
          Rail Madad is your one-stop solution for hassle-free railway complaint resolution! Easily submit your complaints using your PNR number and let our AI-powered system prioritize and categorize them for faster resolution.we ensure every issue is addressed  efficiently.

          </p>
          <p className="text-lg md:text-xl leading-relaxed">
            Experience seamless assistance with our integrated chatbot and join us in revolutionizing the passenger experience.
          </p>
          <button className='bg-slate-500 font-semibold text-black py-2 px-4 rounded-lg hover:bg-slate-700 hover:text-white transition-all duration-300' aria-label="Report Complaint" onClick={handleButtonClick}>
            Report Complaint
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
