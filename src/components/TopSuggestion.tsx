import axios from "axios";
import { useEffect, useState } from "react";
import { useBlogs } from "../context/BlogsContext";
import { useNavigate } from "react-router-dom";

interface User {
  _id: string | number;
  fullname: string;
  profileImg: string;
  username:string;
}

export const TopSuggestion = () => {

  const token = localStorage.getItem("token");
  const [users, setUsers] = useState<User[]>([]);
  // console.log(users)
  const { fetchBlogs } = useBlogs();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post<User[]>(
          "https://blogs-app-backend-mb0v.onrender.com/api/user/suggested",
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  const handleFollowClick = async (userId: string | number) => {
    try {
      const response = await axios.post(
        `https://blogs-app-backend-mb0v.onrender.com/api/user/follow/${userId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(`Follow response:`, response.data);
      const updatedUsers = users.filter(user => user._id !== userId);
      setUsers(updatedUsers);
      fetchBlogs();
    } catch (error) {
      console.error(`Error following user:`, error);
    }
  };

  const navigate = useNavigate();
  
  const handleProfileClick = (username: string) => {
    //console.log(username)
    navigate(`/profile/${username}`);
  };

  return (
    <div className="">
      <h1 className="text-center md:ml-6 ml-2 bg-white text-2xl font-bold md:mt-3 rounded-sm w-[370px] md:w-[300px]">Top Creators of Our App!</h1>
      {Array.isArray(users) && users.length === 0 ? (
        <p className="text-center text-lg mt-2 text-white">No suggestions for you</p>
      ) : (
        users.map((user) => (
          <div key={user._id} className="m-4 md:w-[310px] w-[350px] md:mt-6 p-4 border rounded-lg shadow-md flex items-center space-x-4 bg-[#3C3D37]">
            {/* Profile Image and Name in Single Line */}
            <div className="flex items-center space-x-4">
              <img
                onClick={() => handleProfileClick(user.username)}
                src={user?.profileImg || 'https://imgs.search.brave.com/wJWW2UCCNypggmyzWylg7-wiyrZiQkaTLqNGAfr9-xg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEwLzUyLzY3Lzc3/LzM2MF9GXzEwNTI2/Nzc3MDVfZkF0TVZH/MEF3Y0pKSkc5WFI0/Z09aV0VNbDJPNndM/QXMuanBn'}
                alt=""
                className="w-20 h-20 rounded-full object-cover cursor-pointer"
  
             />
              <h2 className="text-lg text-white font-serif">{user.fullname}</h2>
            </div>
            {/* Follow Button */}
            <button
              onClick={() => handleFollowClick(user._id)}
              className="ml-auto bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
            >
              Follow
            </button>
          </div>
        ))
      )}
    </div>
  );
};

