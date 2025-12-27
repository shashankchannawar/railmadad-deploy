import { useState } from "react";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="py-6 px-4">
      <header className="bg-white shadow-lg border-b-4 border-green-600 rounded-xl overflow-hidden">
        {/* Top Bar */}
        <div className="bg-green-800 text-white py-2">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <span>📞 Helpline: 139</span>
              <span>✉️ support@railmadad.gov.in</span>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <span>Emergency: 112</span>
              <span>|</span>
              <span>24x7 Support</span>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="bg-white">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-green-600 p-3 rounded-lg text-white text-xl">🚂</div>
              <div>
                <h1 className="text-2xl font-bold text-green-800">
                  <a href="/" className="hover:text-green-600 transition">Rail Madad</a>
                </h1>
                <p className="text-sm text-gray-600">रेल मदद - For Inquiry, Suggestion & Grievance</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8 pr-10">
              <a href="/" className="relative group text-gray-700 hover:text-green-600 font-semibold transition-colors">
                Home
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></div>
              </a>
              <a href="/complaint" className="relative group text-gray-700 hover:text-green-600 font-semibold transition-colors">
                Submit Complaint
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></div>
              </a>
              <a href="/contact" className="relative group text-gray-700 hover:text-green-600 font-semibold transition-colors">
                Contact Us
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></div>
              </a>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={toggleMenu}
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <nav className="md:hidden bg-green-50 border-t border-green-200">
            <ul className="flex flex-col space-y-2 p-4">
              <li><a href="/" className="block text-lg font-semibold text-gray-700 hover:text-green-600 px-4 py-3 rounded-lg">🏠 Home</a></li>
              <li><a href="/complaint" className="block text-lg font-semibold text-gray-700 hover:text-green-600 px-4 py-3 rounded-lg">📝 Submit Complaint</a></li>
              <li><a href="/admin" className="block text-lg font-semibold text-gray-700 hover:text-green-600 px-4 py-3 rounded-lg">👨‍💼 Admin Login</a></li>
              <li><a href="/contact" className="block text-lg font-semibold text-gray-700 hover:text-green-600 px-4 py-3 rounded-lg">📞 Contact Us</a></li>
              <li><a href="/login"><button className="w-full text-left text-lg font-semibold py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700">🔐 Login</button></a></li>
            </ul>
          </nav>
        )}

        <div className="bg-gray-50 border-t border-gray-200">
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <span className="w-6 h-4 bg-orange-500 rounded-sm"></span>
              <span className="w-6 h-4 bg-white border rounded-sm"></span>
              <span className="w-6 h-4 bg-green-600 rounded-sm"></span>
              <span className="ml-2">Government of India | Ministry of Railways</span>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
