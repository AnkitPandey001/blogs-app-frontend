import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const FollowingDetails = () => {
  const { LogUser } = useAuth();
  const navigate = useNavigate();



  if (!LogUser) {
    return <div>Loading...</div>;
  }

  function handleProfileClick(username: string) {
    navigate(`/profile/${username}`);
  }

  return (
    <div className="max-h-96 overflow-y-auto p-4">

      {LogUser && LogUser.follower && LogUser.follower.length > 0 ? (
        LogUser.follower.map((ele: any) => (
          <div
            key={ele._id}
            className="flex items-center space-x-4 mb-4 p-4 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <img
              onClick={() => handleProfileClick(ele.username)}
              src={ele.profileImg}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover cursor-pointer"
            />
            <span className="text-lg font-semibold">
              {ele.username} || {ele.fullname}
            </span>
          </div>
        ))
      ) : (
        <p>No followers found</p>
      )}
    </div>
  );
};
