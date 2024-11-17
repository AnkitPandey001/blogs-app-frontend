import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { CreatePost } from "../components/CreatePost";
import axios from "axios";
import { useBlogs } from "../context/BlogsContext";
import { EditProfile } from "../components/EditProfile";
import { FollowingDetails } from "../components/FollowingDetails";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FollowerDetails } from "../components/FollowerDetails";
import { FollowingUserPost } from "../components/FollowingUserPost";
import '../index.css'

export const Profile = () => {
  const { user, updateUser } = useAuth();
  // console.log(user);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showFollowingPosts, setShowFollowingPosts] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  const { fetchBlogs } = useBlogs();
  const navigate = useNavigate();
  


  useEffect(() => {
    updateUser();
  }, []);

  if (!user) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
  

  const handleCreatePostClick = () => {
    setShowCreatePost(true);
  };

  const handleCloseCreatePost = () => {
    setShowCreatePost(false);
  };

  const handleEditProfileClick = () => {
    setShowEditProfile(true);
  };

  const handleCloseEditProfile = () => {
    setShowEditProfile(false);
  };

  const handleShowFollowingPosts = () => {
    setShowFollowingPosts(!showFollowingPosts);
  };

  const handleCloseFollowersModal = () => {
    setShowFollowersModal(false);
  };
  const handleFollowersClick = () => {
    setShowFollowersModal(true);
  };

  const handleCloseFollowingModal = () => {
    setShowFollowingModal(false);
  };
  const handleFollowFollowingClick = () => {
    setShowFollowingModal(true);
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`https://blogs-app-backend-mb0v.onrender.com/api/post/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      //console.log("Post deleted successfully");
      toast.success("Post deleted successfully");
      updateUser();
      fetchBlogs();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await axios.delete(
        "https://blogs-app-backend-mb0v.onrender.com/api/auth/deleteaccount",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // console.log(response.data);
      toast.success(response.data.message);
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.success(error.response.data.error);
    }
  };

  return (
    <div className="mt-28 p-4 max-w-3xl mx-auto">
      {/* Cover Photo */}
      <div className="relative">
        <img
          src={user.user.coverImg}
          alt="Cover"
          className="w-full h-48 object-cover rounded-lg"
        />
        <div className="absolute -bottom-12 left-8">
          <img
           src={user.user.profileImg}
            alt="User Profile"
            className="w-24 h-24 rounded-full border-4 border-white"
          />
        </div>
      </div>

      {/* User Details */}
      <div className="bg-white shadow-md rounded-lg p-6 mt-14 mb-6 flex flex-col items-start space-y-2">
        <h2 className="md:text-2xl text-xl font-bold text-gray-800">
          {user.user.fullname} ||| @{user.user.username}
        </h2>
        <p className="text-gray-600">{user.user.bio}</p>
        <a className=" text-blue-700" href={user.user.link}>{user.user.link}</a>
        <p className="text-gray-600"><span className=" font-bold">Email:-</span>{user.user.email}</p>
        <div className="flex space-x-4">
          <p
            className="text-gray-600 cursor-pointer"
            onClick={handleFollowFollowingClick}
          >
            {user.user.follower.length} Followers
          </p>
          <p
            className="text-gray-600 cursor-pointer"
            onClick={handleFollowersClick}
          >
            {user.user.following.length} Following
          </p>
        </div>
        <div className="flex space-x-4 mt-4">
          <button
            onClick={handleCreatePostClick}
            className="bg-indigo-900 p-2 rounded-2xl text-white"
          >
            Create Post
          </button>
          <button
            onClick={handleEditProfileClick}
            className="bg-indigo-500 p-2 rounded-2xl text-white"
          >
            Edit Profile
          </button>
          <button
            onClick={handleDeleteAccount}
            className="bg-red-800 p-2 rounded-2xl text-white"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* My Posts and Following User Posts Buttons */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setShowFollowingPosts(false)}
          className={`px-6 py-2 font-semibold rounded-full ${
            !showFollowingPosts
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-200 text-gray-800 hover:bg-blue-500 hover:text-white"
          }`}
        >
          My Posts
        </button>
        <button
          onClick={handleShowFollowingPosts}
          className={`px-6 py-2 font-semibold rounded-full ${
            showFollowingPosts
              ? "bg-green-600 text-white shadow-md"
              : "bg-gray-200 text-gray-800 hover:bg-green-500 hover:text-white"
          }`}
        >
          Following User Posts
        </button>
      </div>

      {/* //! ------------------------------------------- */}
      {/* Posts Display */}
      {showFollowingPosts ? (
        <div className="space-y-4">
          <FollowingUserPost />
        </div>
      ) : (
        <div className="space-y-4">
          {user.posts.length > 0 ? (
            user.posts.map((post) => (
              <div key={post._id} className="bg-white shadow-md rounded-lg p-4">
                <img
                  src={post.img}
                  alt="Post"
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                <span className=" font-bold">Category:-</span>{post.category}
                </h4>
                <p className="text-gray-700 mb-2"><span className=" font-bold text-xl">Title:-</span>{post.title}</p>
                <p className="text-gray-700 mb-2">{post.text}</p>
                <div className="flex justify-between items-center text-gray-500 text-sm">
                  <div>
                  <div className="border-b-4 border-solid border-gray-500"></div>

                    <span className="">{post.likes.length} Likes</span>
                    <span className="ml-7">
                      {post.comments.length} Comments
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeletePost(post._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center">No posts available</p>
          )}
        </div>
      )}

      {/* //! ----------------------------------------- */}

      {/* Modals */}
      {showCreatePost && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={handleCloseCreatePost}
          ></div>
          <div className="bg-white rounded-lg p-6 z-10 max-w-lg w-full relative">
            <button
              onClick={handleCloseCreatePost}
              className="text-4xl absolute top-2 right-2 text-gray-600 hover:text-red-800"
            >
              &times;
            </button>
            <CreatePost />
          </div>
        </div>
      )}

      {/* //!------------------------ */}

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pt-56 overflow-auto">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={handleCloseEditProfile}
          ></div>
          <div className="bg-white rounded-lg p-6 z-10 max-w-lg w-full relative">
            <button
              onClick={handleCloseEditProfile}
              className="text-4xl absolute top-2 right-2 text-gray-600 hover:text-red-800  mt-60"
            >
              &times;
            </button>
            <EditProfile />
          </div>
        </div>
      )}

      {showFollowersModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pt-56 overflow-auto">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={handleCloseFollowersModal}
          ></div>
          <div className="bg-white rounded-lg p-6 z-10 max-w-lg w-full relative">
            <button
              onClick={handleCloseFollowersModal}
              className="text-4xl absolute top-2 right-2 text-gray-600 hover:text-red-800"
            >
              &times;
            </button>
            <div>
              <FollowerDetails />
            </div>
          </div>
        </div>
      )}

      {showFollowingModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pt-56 overflow-auto">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={handleCloseFollowersModal}
          ></div>
          <div className="bg-white rounded-lg p-6 z-10 max-w-lg w-full relative">
            <button
              onClick={handleCloseFollowingModal}
              className="text-4xl absolute top-2 right-2 text-gray-600 hover:text-red-800"
            >
              &times;
            </button>
            <div>
              <FollowingDetails />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
