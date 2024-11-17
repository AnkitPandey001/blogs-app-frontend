import { WelcomePages } from "../components/WelcomePages";
import { TopSuggestion } from "../components/TopSuggestion";
import { AllBlogs } from "../components/AllBlogs";

export const Home = () => {
  return (
    <div className="flex flex-col items-center justify-start h-[95vh] relative">
      {/* First Section with Welcome Message */}
      <div 
        className="w-full flex items-center justify-center rounded-2xl" 
        style={{ 
          height: '30vh', 
          background: 'linear-gradient(135deg, #4CAF50, #66BB6A)' 
        }}
      >
        <WelcomePages />
      </div>


      {/* Second Section - Content Below */}
      <div className="w-full flex flex-col md:flex-row mt-[10vh]">
        {/* Left side for Top Suggestions */}
        <div className="w-full md:w-[25%] pr-4 mb-6 md:mb-0 md:sticky md:top-0">
          <TopSuggestion />
        </div>

        {/* Right side for All Blogs */}
        <div className="w-full md:w-[75%] pl-4">
          <AllBlogs />
        </div>
      </div>
    </div>
  );
};