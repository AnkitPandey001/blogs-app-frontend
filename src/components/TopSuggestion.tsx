import axios from "axios";
import { useEffect, useState } from "react";
import { useBlogs } from "../context/BlogsContext";
import { useNavigate } from "react-router-dom";

interface User {
  _id: string | number;
  fullname: string;
  imageUrl: string;
  username:string;
}

export const TopSuggestion = () => {

  const token = localStorage.getItem("token");
  const [users, setUsers] = useState<User[]>([]);
  const { fetchBlogs } = useBlogs();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post<User[]>(
          "/api/user/suggested",
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
      console.log(`Follow response:`, response.data);
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
    <div>
      <h1 className="text-center text-2xl font-bold mb-6">Top Creators of Our App!</h1>
      {Array.isArray(users) && users.length === 0 ? (
        <p className="text-center text-lg">No suggestions for you</p>
      ) : (
        users.map((user) => (
          <div key={user._id} className="m-4 p-4 border rounded-lg shadow-md flex items-center space-x-4 bg-white">
            {/* Profile Image and Name in Single Line */}
            <div className="flex items-center space-x-4">
              <img
                onClick={() => handleProfileClick(user.username)}
                src="https://imgs.search.brave.com/ILui-8Aqkx4wZV_SgFiB6H6RLej3LcnKSTjp0I7SHb0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5saWNkbi5jb20v/ZG1zL2ltYWdlL0Q1/NjEyQVFHc2o2NUVz/WkhOZHcvYXJ0aWNs/ZS1jb3Zlcl9pbWFn/ZS1zaHJpbmtfNzIw/XzEyODAvMC8xNjg0/MDk0ODgxMTk1P2U9/MjE0NzQ4MzY0NyZ2/PWJldGEmdD1yc25Q/aFFsVUc4Y2NHVmNy/VGV1OGU2bTdBRDQ1/bF9EYWhJeElBM3dN/UDMw"
                alt={user.fullname}
                className="w-20 h-20 rounded-full object-cover cursor-pointer"
             
             />
              <h2 className="text-lg font-semibold">{user.fullname}</h2>
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