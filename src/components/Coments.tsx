import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useBlogs } from '../context/BlogsContext';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from '../utils/Utils';
import { Comment,CommentsProps } from '../utils/Utils';


export const Coments = ({ comments, onClose, postId }: CommentsProps) => {
  const loggedInUserId = localStorage.getItem('userId');
  const [localComments, setLocalComments] = useState<Comment[]>(comments);
  const { fetchBlogs } = useBlogs();
  const navigate = useNavigate();

  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  const handleDeleteComment = async (commentId: string) => {
    try {
      await axios.delete(
        `https://blogs-app-backend-mb0v.onrender.com/api/post/comment/${postId}/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      // Update local state to reflect the UI instantly
      setLocalComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId)
      );
      toast.success("Comment deleted successfully");
      fetchBlogs();
    } catch (error) {
      const axiosError = error as AxiosError;
      toast.error(axiosError.response?.data?.error || 'Failed to delete comment');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-auto">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        {localComments.length > 0 ? (
          <div className="space-y-4">
            {localComments.map((comment) => (
              <div key={comment._id} className="border-b border-gray-300 pb-4">
                <div className="flex items-center mb-2">
                  {/* Conditional rendering for the profile image and user details */}
                  {comment.user ? (
                    <img
                      onClick={() => navigate(`/profile/${comment.user?.username }`)}
                      src={comment.user.profileImg}
                      alt={comment.user.fullname}
                      className="w-10 h-10 rounded-full object-cover mr-3 cursor-pointer"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div> 
                  )}

                  <div>
                    {/* Display user name or fallback to 'Anonymous' */}
                    <h3 className="text-lg font-semibold cursor-pointer">
                      {comment.user ? comment.user.fullname : 'Anonymous'}
                    </h3>
                    <p className="text-sm mt-2 text-gray-500">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {/* Only show delete button if the logged-in user is the author of the comment */}
                  {comment.user && comment.user._id === loggedInUserId && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="ml-auto text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  )}
                </div>

                {/* Display the comment text */}
                <p className="text-gray-700">{comment.text}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No comments for this post</p>
        )}
      </div>
    </div>
  );
};
