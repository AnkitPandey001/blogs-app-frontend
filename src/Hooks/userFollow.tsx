import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useBlogs } from "../context/BlogsContext";


export const useFollow = () => {
  const { updateUser } = useAuth();
  const { fetchBlogs } = useBlogs();
  const token = localStorage.getItem("token");

  const toggleFollow = async (userId: string) => {
    try {
       await axios.post(
        `/api/user/follow/${userId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
     // console.log(`Follow/Unfollow response:`, response.data);
      fetchBlogs();
      await updateUser();
    } catch (error) {
      console.error(`Error following/unfollowing user:`, error);
    }
  };

  return { toggleFollow };
};