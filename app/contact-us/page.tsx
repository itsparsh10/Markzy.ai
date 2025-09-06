import Sidebar from '../components/Sidebar';

export default function ContactUs() {
  return (
    <>
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="bg-gray-50 p-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <i className="fas fa-envelope text-[#46adb6] w-5"></i>
              <span className="text-gray-600 font-medium">Contact Us</span>
            </div>
            <div>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Support</span>
            </div>
          </div>
        </div>
        
        {/* Content Area - Compact layout to fit in viewport */}
        <div className="flex-1 p-2 overflow-y-auto flex flex-col bg-[#f8fafc]">
          {/* Contact Banner */}
          <div className="bg-gradient-to-r from-[#1d1f89] to-[#2a2cb6] text-white rounded-lg p-3 shadow-md mb-3 border border-[#1d1f89]/20 overflow-hidden relative">
            <div className="flex items-start gap-3">
              <div className="bg-white rounded-lg shadow-md w-10 h-10 flex items-center justify-center flex-shrink-0 border-2 border-[#46adb6]">
                <i className="fas fa-envelope text-[#1d1f89]"></i>
              </div>
              <div>
                <h2 className="text-lg font-bold">Contact Our Support Team</h2>
                <p className="text-white/90 text-sm mt-1">We're here to help with any questions or issues.</p>
              </div>
            </div>
          </div>
          
          {/* Main Content - max-height to ensure viewport fit */}
          <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm max-h-[70vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Get in Touch</h2>
            
            {/* Contact Form - Made compact to fit viewport */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#46adb6] focus:border-transparent"
                  placeholder="Enter your name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#46adb6] focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#46adb6] focus:border-transparent">
                  <option value="">Select a subject</option>
                  <option value="tech">Technical Support</option>
                  <option value="billing">Billing Question</option>
                  <option value="feature">Feature Request</option>
                  <option value="feedback">General Feedback</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#46adb6] focus:border-transparent h-20"
                  placeholder="How can we help you today?"
                ></textarea>
              </div>
              
              <div className="md:col-span-2 flex justify-end">
                <button className="bg-[#1d1f89] text-white px-4 py-2 rounded-md text-sm font-medium">
                  Send Message
                </button>
              </div>
            </div>
            
            {/* Contact Info */}
            <div className="border-t border-gray-200 pt-3 mt-2">
              <h3 className="text-md font-bold mb-2 text-gray-700">Other Ways to Reach Us</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-envelope text-blue-600"></i>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-700">Email</h4>
                    <p className="text-sm text-blue-600">hello@markzy.ai</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-phone text-green-600"></i>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-700">Phone</h4>
                    <p className="text-sm text-green-600">(555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-comment-alt text-purple-600"></i>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-700">Live Chat</h4>
                    <p className="text-sm text-purple-600">Available 9AM-5PM ET</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
