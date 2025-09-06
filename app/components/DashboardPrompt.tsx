import Link from 'next/link';

interface DashboardPromptProps {
  username: string;
}

export default function DashboardPrompt({ username }: DashboardPromptProps) {
  return (
    <div className="bg-white rounded-lg border-l-4 border-[#46adb6] border border-gray-200 p-3 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="text-[#46adb6] text-xl mt-1">
          <i className="fas fa-lightbulb"></i>
        </div>
        <div>
          <h2 className="text-md font-bold text-gray-900 mb-1">Ready to make some magic, {username}!</h2>
          <p className="text-sm text-gray-500 mb-1">You&apos;ve set up your brand, a product, and analyzed your tone of voice!</p>
          <p className="text-sm text-gray-600 mb-2">Now it&apos;s time to head to the Dashboard to see your details and get a little tour so you can start making your very own markzy</p>
          
          <Link href="/dashboard">
            <button className="bg-[#46adb6] hover:bg-[#1d1f89] text-white px-4 py-1.5 rounded-full font-semibold shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 text-sm">
              <span>Take me to the Dashboard!</span>
              <i className="fas fa-arrow-right"></i>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
