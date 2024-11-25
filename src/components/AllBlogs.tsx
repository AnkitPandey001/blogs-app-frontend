import { useState } from "react";
import { BlogList } from "./BlogList";
import { FaTh, FaCode, FaCalendarAlt, FaNewspaper } from "react-icons/fa";

export const AllBlogs = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile view
  useState(() => {
    const updateView = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", updateView);
    updateView();
    return () => window.removeEventListener("resize", updateView);
  }, []);

  return (
    <div className="p-2">
      <nav className="flex justify-center md:justify-start md:ml-10 space-x-14 mb-4">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`${
            selectedCategory === "all"
              ? "bg-indigo-900 text-white font-bold"
              : "bg-white text-gray-700"
          } flex items-center justify-center px-4 py-2 rounded-md`}
        >
          {isMobile ? <FaTh size={20} /> : "All"}
        </button>
        <button
          onClick={() => setSelectedCategory("coding")}
          className={`${
            selectedCategory === "coding"
              ? "bg-indigo-900 text-white font-bold"
              : "bg-white text-gray-700"
          } flex items-center justify-center px-4 py-2 rounded-md`}
        >
          {isMobile ? <FaCode size={20} /> : "Coding"}
        </button>
        <button
          onClick={() => setSelectedCategory("event")}
          className={`${
            selectedCategory === "event"
              ? "bg-indigo-900 text-white font-bold"
              : "bg-white text-gray-700"
          } flex items-center justify-center px-4 py-2 rounded-md`}
        >
          {isMobile ? <FaCalendarAlt size={20} /> : "Events"}
        </button>
        <button
          onClick={() => setSelectedCategory("news")}
          className={`${
            selectedCategory === "news"
              ? "bg-indigo-900 text-white font-bold"
              : "bg-white text-gray-700"
          } flex items-center justify-center px-4 py-2 rounded-md`}
        >
          {isMobile ? <FaNewspaper size={20} /> : "News"}
        </button>
      </nav>
      <BlogList category={selectedCategory} />
    </div>
  );
};
