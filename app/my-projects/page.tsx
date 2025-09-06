import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

export default function MyProjects() {
  return (
    <div className="h-full w-full flex overflow-hidden bg-gray-50">
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="bg-gray-50 p-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <i className="fas fa-project-diagram text-[#46adb6] w-5"></i>
              <span className="text-gray-600 font-medium">My Projects</span>
            </div>
            <div>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Projects</span>
            </div>
          </div>
        </div>
        
        {/* Content Area - Compact layout to fit in viewport */}
        <div className="flex-1 p-2 overflow-y-auto flex flex-col bg-[#f8fafc]">
          {/* Projects Banner */}
          <div className="bg-gradient-to-r from-green-600 to-teal-500 text-white rounded-lg p-3 shadow-md mb-3 border border-green-600/20 overflow-hidden relative">
            <div className="flex items-start gap-3">
              <div className="bg-white rounded-lg shadow-md w-10 h-10 flex items-center justify-center flex-shrink-0 border-2 border-[#46adb6]">
                <i className="fas fa-project-diagram text-green-600"></i>
              </div>
              <div>
                <h2 className="text-lg font-bold">My Marketing Projects</h2>
                <p className="text-white/90 text-sm mt-1">Manage and track all your marketing projects in one place.</p>
              </div>
            </div>
          </div>
          
          {/* Main Content - max-height to ensure viewport fit */}
          <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm max-h-[70vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">My Projects</h2>
              <button className="bg-[#46adb6] text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1">
                <i className="fas fa-plus"></i>
                <span>New Project</span>
              </button>
            </div>
            
            {/* Project Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">Q2 Social Media Campaign</h3>
                    <p className="text-xs text-gray-500 mt-1">Created June 1, 2025</p>
                  </div>
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">In Progress</span>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Comprehensive social media strategy for Q2 product launch.</p>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>60%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">Email Marketing Revamp</h3>
                    <p className="text-xs text-gray-500 mt-1">Created May 15, 2025</p>
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">Completed</span>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Redesign of all email templates and sequences.</p>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>100%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">Content Calendar</h3>
                    <p className="text-xs text-gray-500 mt-1">Created May 28, 2025</p>
                  </div>
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">In Progress</span>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">6-month content calendar for blog and social media.</p>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">SEO Optimization</h3>
                    <p className="text-xs text-gray-500 mt-1">Created June 2, 2025</p>
                  </div>
                  <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full">Just Started</span>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Website SEO audit and optimization plan.</p>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>15%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-yellow-600 h-1.5 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer positioned after main content */}
        <Footer />
      </div>
    </div>
  );
}
