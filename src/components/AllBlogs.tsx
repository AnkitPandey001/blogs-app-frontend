import { useState } from "react";
import { BlogList } from "./BlogList";

export const AllBlogs = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <div className="p-4">
      <nav className="flex space-x-4 mb-6">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`text-blue-500  ${selectedCategory === "all" ? "bg-indigo-500 rounded-xl w-28 text-white" : ""}`}
        >
          All Posts
        </button>
        <button
          onClick={() => setSelectedCategory("coding")}
          className={`text-blue-500  ${selectedCategory === "coding" ? "bg-indigo-500 rounded-xl w-28 text-white" : ""}`}
        >
          Coding
        </button>
        <button
          onClick={() => setSelectedCategory("event")}
          className={`text-blue-500  ${selectedCategory === "event" ? "bg-indigo-500 rounded-xl w-28 text-white" : ""}`}
        >
          Events
        </button>
        <button
          onClick={() => setSelectedCategory("news")}
          className={`text-blue-500  ${selectedCategory === "news" ? "bg-indigo-500 rounded-xl w-28 text-white" : ""}`}
        >
          News
        </button>
      </nav>
      <BlogList category={selectedCategory} />
    </div>
  );
};