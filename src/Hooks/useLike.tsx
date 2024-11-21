import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useBlogs } from "../context/BlogsContext";

export const useLike = () => {
  const { updateUser } = useAuth();
  const { fetchBlogs } = useBlogs();
  const token = localStorage.getItem("token");

  const toggleLike = async (userId: string) => {
        try {
             await axios.post(
              `/api/post/like/${userId}`,
              {},
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
          //  console.log(`Follow response:`, response.data);
            await updateUser();
            fetchBlogs();
          } catch (error) {
            console.error(`Error following user:`, error);
          }
  };

  return { toggleLike };
};