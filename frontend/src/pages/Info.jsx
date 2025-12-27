import React, { useState } from 'react';
import { 
  Train, Clock, MapPin, Utensils, Wifi, Shield, Heart, Wrench, 
  Sparkles, Zap, ShieldAlert, Phone, Users, CreditCard, Calendar,
  CheckCircle, Star, ArrowRight, ChevronDown, ChevronUp, Info
} from 'lucide-react';

const RailwayInfo = () => {
  const [expandedService, setExpandedService] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const serviceCategories = [
    { id: 'all', name: 'All Services', icon: <Train className="w-5 h-5" /> },
    { id: 'booking', name: 'Booking & Reservations', icon: <Calendar className="w-5 h-5" /> },
    { id: 'onboard', name: 'Onboard Services', icon: <Users className="w-5 h-5" /> },
    { id: 'support', name: 'Support & Safety', icon: <Shield className="w-5 h-5" /> },
    { id: 'facilities', name: 'Facilities & Amenities', icon: <Sparkles className="w-5 h-5" /> }
  ];

  const services = [
    {
      id: 'online_booking',
      category: 'booking',
      title: 'Online Ticket Booking',
      subtitle: 'Book tickets anytime, anywhere',
      description: 'Easy and convenient online ticket booking system with real-time seat availability, multiple payment options, and instant confirmation.',
      icon: <CreditCard className="w-8 h-8" />,
      color: 'green',
      features: [
        'Real-time seat availability',
        'Multiple payment gateways',
        'Instant e-ticket generation',
        'Booking history tracking',
        'Cancellation & refund options',
        'Mobile-friendly interface'
      ],
      benefits: [
        'Save time and avoid queues',
        'Book 24/7 from anywhere',
        'Secure payment processing',
        'Digital ticket storage'
      ],
      howItWorks: [
        'Search for trains between stations',
        'Select your preferred train and class',
        'Choose seats and add passenger details',
        'Make payment securely',
        'Download your e-ticket instantly'
      ]
    },
    {
      id: 'pnr_status',
      category: 'booking',
      title: 'PNR Status Check',
      subtitle: 'Track your booking status',
      description: 'Check your PNR status, seat confirmation, and booking details in real-time with detailed journey information.',
      icon: <Info className="w-8 h-8" />,
      color: 'blue',
      features: [
        'Real-time PNR status updates',
        'Seat confirmation details',
        'Journey timeline tracking',
        'Passenger list verification',
        'Coach and berth information',
        'SMS and email alerts'
      ],
      benefits: [
        'Stay updated on booking status',
        'Plan journey accordingly',
        'Get timely notifications',
        'Avoid last-minute surprises'
      ],
      howItWorks: [
        'Enter your 10-digit PNR number',
        'View current booking status',
        'Check passenger details',
        'See seat/berth assignments',
        'Get real-time updates'
      ]
    },
    {
      id: 'train_schedule',
      category: 'booking',
      title: 'Train Schedule & Live Tracking',
      subtitle: 'Real-time train information',
      description: 'Get accurate train schedules, live running status, platform information, and delay notifications.',
      icon: <Clock className="w-8 h-8" />,
      color: 'purple',
      features: [
        'Live train tracking',
        'Platform information',
        'Delay notifications',
        'Route and stoppage details',
        'Historical punctuality data',
        'Station facilities info'
      ],
      benefits: [
        'Plan arrivals and departures',
        'Avoid waiting at stations',
        'Stay informed about delays',
        'Better travel planning'
      ],
      howItWorks: [
        'Search by train number or route',
        'View current running status',
        'Check platform information',
        'Get delay notifications',
        'Plan your journey timing'
      ]
    },
    {
      id: 'food_service',
      category: 'onboard',
      title: 'Food & Catering Services',
      subtitle: 'Quality meals during travel',
      description: 'Order fresh, hygienic meals from authorized vendors with diverse menu options and contactless delivery.',
      icon: <Utensils className="w-8 h-8" />,
      color: 'orange',
      features: [
        'Pre-order meal options',
        'Diverse cuisine choices',
        'Hygienic food preparation',
        'Contactless delivery',
        'Special dietary meals',
        'Quality assurance checks'
      ],
      benefits: [
        'Fresh and tasty meals',
        'Convenient ordering',
        'Safe and hygienic',
        'Multiple cuisine options'
      ],
      howItWorks: [
        'Browse menu options online',
        'Select meals for your journey',
        'Make payment securely',
        'Receive confirmation',
        'Get meals delivered to your seat'
      ]
    },
    {
      id: 'wifi_service',
      category: 'onboard',
      title: 'Free Wi-Fi Services',
      subtitle: 'Stay connected during travel',
      description: 'Complimentary high-speed internet access available in select trains for seamless connectivity during your journey.',
      icon: <Wifi className="w-8 h-8" />,
      color: 'cyan',
      features: [
        'High-speed internet access',
        'Easy login process',
        'Multiple device support',
        'Secure connection',
        'Coverage in most coaches',
        'Fair usage policy'
      ],
      benefits: [
        'Stay connected with family',
        'Work while traveling',
        'Entertainment streaming',
        'Social media access'
      ],
      howItWorks: [
        'Connect to RailWire network',
        'Complete OTP verification',
        'Accept terms and conditions',
        'Start browsing immediately',
        'Enjoy free high-speed internet'
      ]
    },
    {
      id: 'medical_emergency',
      category: 'support',
      title: 'Medical Emergency Support',
      subtitle: '24/7 medical assistance',
      description: 'Round-the-clock medical support with trained staff, first aid facilities, and emergency response systems.',
      icon: <Heart className="w-8 h-8" />,
      color: 'red',
      features: [
        '24/7 medical helpline',
        'Trained medical staff',
        'First aid facilities',
        'Emergency medication',
        'Hospital coordination',
        'Ambulance services at stations'
      ],
      benefits: [
        'Immediate medical attention',
        'Expert healthcare support',
        'Emergency coordination',
        'Peace of mind during travel'
      ],
      howItWorks: [
        'Call medical emergency number',
        'Describe the medical situation',
        'Get immediate assistance',
        'Receive first aid treatment',
        'Transfer to hospital if needed'
      ]
    },
    {
      id: 'women_safety',
      category: 'support',
      title: 'Women Safety Services',
      subtitle: 'Safe and secure travel',
      description: 'Dedicated women safety measures including reserved coaches, security personnel, and 24/7 helpline support.',
      icon: <ShieldAlert className="w-8 h-8" />,
      color: 'pink',
      features: [
        'Ladies special coaches',
        'Women security personnel',
        '24/7 women helpline',
        'CCTV surveillance',
        'Emergency alarm systems',
        'Safe boarding assistance'
      ],
      benefits: [
        'Enhanced security for women',
        'Comfortable travel environment',
        'Quick response to issues',
        'Dedicated support staff'
      ],
      howItWorks: [
        'Book ladies reserved coaches',
        'Use women helpline if needed',
        'Alert security for any issues',
        'Access emergency alarm systems',
        'Get assistance from staff'
      ]
    },
    {
      id: 'cleaning_maintenance',
      category: 'facilities',
      title: 'Cleaning & Maintenance',
      subtitle: 'Clean and hygienic facilities',
      description: 'Regular cleaning and maintenance services ensuring hygienic washrooms, clean coaches, and well-maintained facilities.',
      icon: <Sparkles className="w-8 h-8" />,
      color: 'blue',
      features: [
        'Regular coach cleaning',
        'Hygienic washroom maintenance',
        'Sanitization services',
        'Bedroll and linen services',
        'Waste management',
        'Deep cleaning protocols'
      ],
      benefits: [
        'Clean and hygienic environment',
        'Comfortable travel experience',
        'Health and safety assurance',
        'Well-maintained facilities'
      ],
      howItWorks: [
        'Scheduled cleaning at stations',
        'Continuous maintenance during journey',
        'Regular sanitization',
        'Quality checks and inspections',
        'Feedback-based improvements'
      ]
    },
    {
      id: 'coach_maintenance',
      category: 'facilities',
      title: 'Coach Maintenance Services',
      subtitle: 'Well-maintained rolling stock',
      description: 'Comprehensive coach maintenance ensuring safety, comfort, and reliability of all railway rolling stock.',
      icon: <Wrench className="w-8 h-8" />,
      color: 'yellow',
      features: [
        'Regular safety inspections',
        'Air conditioning maintenance',
        'Electrical system checks',
        'Mechanical repairs',
        'Safety equipment verification',
        'Preventive maintenance'
      ],
      benefits: [
        'Safe and reliable travel',
        'Comfortable journey conditions',
        'Reduced breakdown incidents',
        'Enhanced passenger safety'
      ],
      howItWorks: [
        'Scheduled maintenance checks',
        'Safety inspections',
        'Repair and replacement',
        'Quality assurance testing',
        'Certification for service'
      ]
    },
    {
      id: 'electronics_support',
      category: 'facilities',
      title: 'Electronics & Power Support',
      subtitle: 'Power and charging facilities',
      description: 'Reliable power supply and charging facilities with modern electronic systems and passenger amenities.',
      icon: <Zap className="w-8 h-8" />,
      color: 'purple',
      features: [
        'Charging points at seats',
        'Power backup systems',
        'Electronic display boards',
        'Public announcement systems',
        'LED lighting systems',
        'Emergency power supply'
      ],
      benefits: [
        'Keep devices charged',
        'Clear travel information',
        'Well-lit compartments',
        'Reliable power supply'
      ],
      howItWorks: [
        'Locate charging points near seats',
        'Connect your devices safely',
        'Use electronic displays for info',
        'Listen to announcements',
        'Report any electrical issues'
      ]
    },
    {
      id: 'complaint_system',
      category: 'support',
      title: 'Complaint & Grievance System',
      subtitle: 'Voice your concerns effectively',
      description: 'Efficient complaint handling system with multiple channels for feedback, quick resolution, and status tracking.',
      icon: <Phone className="w-8 h-8" />,
      color: 'indigo',
      features: [
        'Online complaint submission',
        'Mobile complaint tracking',
        'Multiple feedback channels',
        'Quick response system',
        'Escalation procedures',
        'Status notifications'
      ],
      benefits: [
        'Easy complaint submission',
        'Quick resolution process',
        'Transparent tracking',
        'Improved service quality'
      ],
      howItWorks: [
        'Submit complaint online or via phone',
        'Receive complaint reference number',
        'Track status regularly',
        'Get updates on resolution',
        'Provide feedback on service'
      ]
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      green: { bg: 'from-green-500 to-green-600', light: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
      blue: { bg: 'from-blue-500 to-blue-600', light: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
      purple: { bg: 'from-purple-500 to-purple-600', light: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
      orange: { bg: 'from-orange-500 to-orange-600', light: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
      cyan: { bg: 'from-cyan-500 to-cyan-600', light: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200' },
      red: { bg: 'from-red-500 to-red-600', light: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
      pink: { bg: 'from-pink-500 to-pink-600', light: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200' },
      yellow: { bg: 'from-yellow-500 to-yellow-600', light: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-200' },
      indigo: { bg: 'from-indigo-500 to-indigo-600', light: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' }
    };
    return colorMap[color] || colorMap.green;
  };

  const filteredServices = activeCategory === 'all' 
    ? services 
    : services.filter(service => service.category === activeCategory);

  const toggleExpanded = (serviceId) => {
    setExpandedService(expandedService === serviceId ? null : serviceId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Train className="w-20 h-20 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-4">Railway Services</h1>
          <p className="text-xl text-green-100 mb-8">Comprehensive guide to all our services and facilities</p>
          <div className="flex items-center justify-center gap-4 text-green-100">
            <CheckCircle className="w-5 h-5" />
            <span>24/7 Support</span>
            <CheckCircle className="w-5 h-5" />
            <span>Quality Assured</span>
            <CheckCircle className="w-5 h-5" />
            <span>Customer Focused</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Category Filter */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Service Categories</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {serviceCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 ${
                  activeCategory === category.id
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-green-50 border border-gray-200'
                }`}
              >
                {category.icon}
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="space-y-8">
          {filteredServices.map((service) => {
            const colors = getColorClasses(service.color);
            const isExpanded = expandedService === service.id;

            return (
              <div key={service.id} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Service Header */}
                <div className={`bg-gradient-to-r ${colors.bg} text-white p-8`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="bg-white bg-opacity-20 p-4 rounded-2xl">
                        {service.icon}
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold mb-2">{service.title}</h3>
                        <p className="text-white text-opacity-90 text-lg">{service.subtitle}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleExpanded(service.id)}
                      className="bg-white bg-opacity-20 hover:bg-opacity-30 p-3 rounded-full transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                    </button>
                  </div>
                </div>

                {/* Service Content */}
                <div className="p-8">
                  <p className="text-lg text-gray-700 mb-6 leading-relaxed">{service.description}</p>

                  {isExpanded && (
                    <div className="space-y-8">
                      {/* Features */}
                      <div>
                        <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <Star className="w-5 h-5 text-yellow-500" />
                          Key Features
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {service.features.map((feature, index) => (
                            <div key={index} className={`${colors.light} ${colors.border} border rounded-lg p-3`}>
                              <div className="flex items-center gap-2">
                                <CheckCircle className={`w-4 h-4 ${colors.text}`} />
                                <span className="text-gray-700 text-sm">{feature}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Benefits */}
                      <div>
                        <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          Benefits
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {service.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                              <ArrowRight className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* How It Works */}
                      <div>
                        <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <Info className="w-5 h-5 text-blue-500" />
                          How It Works
                        </h4>
                        <div className="space-y-3">
                          {service.howItWorks.map((step, index) => (
                            <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                              <div className={`w-8 h-8 ${colors.bg} bg-gradient-to-r text-white rounded-full flex items-center justify-center text-sm font-bold`}>
                                {index + 1}
                              </div>
                              <span className="text-gray-700">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {!isExpanded && (
                    <div className="text-center">
                      <button
                        onClick={() => toggleExpanded(service.id)}
                        className={`${colors.text} hover:underline font-semibold flex items-center gap-2 mx-auto`}
                      >
                        Learn More
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white text-center">
          <Phone className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Need Help with Our Services?</h2>
          <p className="text-green-100 text-lg mb-6">
            Our customer support team is available 24/7 to assist you with any questions or concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="bg-white bg-opacity-20 px-6 py-3 rounded-full">
              <strong>Helpline: 139</strong>
            </div>
            <div className="bg-white bg-opacity-20 px-6 py-3 rounded-full">
              <strong>Email: support@indianrail.gov.in</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RailwayInfo;