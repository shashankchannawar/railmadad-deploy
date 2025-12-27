const Footer = () => {
    return (
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            {/* Logo + About */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-green-600 p-3 rounded-lg text-white text-xl">🚂</div>
                <div>
                  <h3 className="text-xl font-bold">Rail Madad</h3>
                  <p className="text-gray-400 text-sm">रेल मदद</p>
                </div>
              </div>
              <p className="text-gray-300 mb-6 text-sm">
                Empowering passengers with a unified platform for railway grievance redressal.
              </p>
            </div>
  
            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-green-400">Quick Links</h4>
              <ul className="space-y-3">
                {[
                  { name: "Home", href: "/" },
                  { name: "Submit Complaint", href: "/complaint" },
                  { name: "Contact Us", href: "/contact" },
                ].map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-green-400 text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
  
            {/* Important Links */}
            <div>
  <h4 className="text-lg font-semibold mb-6 text-green-400">Important Links</h4>
  <ul className="space-y-3">
    {[
      { name: "IRCTC", url: "https://www.irctc.co.in/nget/train-search" },
      { name: "Indian Railways", url: "https://indianrailways.gov.in/" },
      { name: "Ministry of Railways", url: "https://indianrailways.gov.in/railwayboard/" },
      { name: "Railway Board", url: "https://indianrailways.gov.in/railwayboard/view_section.jsp?lang=0&id=0,1,304,366,526" },
    ].map((link, index) => (
      <li key={index}>
        <a
          href={link.url}
          target="_blank" // opens in new tab
          rel="noopener noreferrer" // security best practice
          className="text-gray-300 hover:text-green-400 text-sm"
        >
          {link.name}
        </a>
      </li>
    ))}
  </ul>
</div>

  
            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-green-400">Contact Us</h4>
              <div className="space-y-4">
                <p className="text-gray-300 text-sm">📞 139 (24x7 Toll Free)</p>
                <p className="text-gray-300 text-sm">✉️ support@railmadad.gov.in</p>
                <p className="text-gray-300 text-sm">
                  📍 Ministry of Railways, Rail Bhavan, New Delhi
                </p>
              </div>
            </div>
          </div>
        </div>
  
        {/* Bottom Bar */}
        <div className="bg-gray-800 border-t border-gray-700">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="flex space-x-1">
                  <span className="w-4 h-3 bg-orange-500 rounded-sm"></span>
                  <span className="w-4 h-3 bg-white rounded-sm"></span>
                  <span className="w-4 h-3 bg-green-600 rounded-sm"></span>
                </div>
                <span className="text-gray-300 text-sm">
                  Government of India • Ministry of Railways
                </span>
              </div>
              <p className="text-gray-400 text-sm mt-4 md:mt-0">
                &copy; 2025 Rail Madad. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  