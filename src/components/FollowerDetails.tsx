import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const FollowerDetails = () => {
  const { LogUser } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="max-h-96 overflow-y-auto p-4">
      {LogUser &&
        LogUser.following?.map((ele: any) => (
          <div
            key={ele._id}
            className="flex items-center space-x-4 mb-4 p-4 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <img
              onClick={()=> navigate(`/profile/${ele.username}`)}
              src={ele.profileImg }
              alt="Profile"
              className=" cursor-pointer w-12 h-12 rounded-full object-cover"
            />
            <span className="text-lg font-semibold">{ele.username} || {ele.fullname}</span>
           
          </div>
        ))}
    </div>
  );
};

