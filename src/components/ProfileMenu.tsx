import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProfileMenuProps {
  closeMenu: () => void;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({ closeMenu }) => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="bg-white shadow-lg rounded-lg w-48 p-4 mt-2">
      {isAuthenticated && (
        <div className="mb-2">
          <NavLink
            to="/profile"
            className={({ isActive }: { isActive: boolean }) =>
              isActive
                ? "block text-blue-600 font-semibold text-lg px-4 py-2 rounded-lg bg-blue-100 hover:bg-blue-200"
                : "block text-white bg-slate-600 text-lg px-4 py-2 rounded-lg hover:bg-gray-500"
            }
            onClick={closeMenu}
          >
            Profile
          </NavLink>
        </div>
      )}
      <div>
        <button
          onClick={() => {
            logout();
            closeMenu();
          }}
          className="block text-white w-full  bg-orange-900 text-lg px-4 py-2 rounded-lg hover:bg-red-500 text-left"
        >
          Logout
        </button>
      </div>
    </div>
  );
};
