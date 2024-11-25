import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ProfileMenu } from "./ProfileMenu";
import { MdAccountCircle } from "react-icons/md";
export const Navbar: React.FC = () => {
  const { isAuthenticated, } = useAuth();
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const handleClicked = () => {
    setProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
      setProfileMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div 
      className="fixed bg-[#3C3D37] m-5 md:w-[60%] w-[90%] md:h-[60px] shadow-md backdrop-blur-lg rounded-xl sm:ml-[42px] md:ml-[20%]" 
      style={{ zIndex: 1000 }}
    >
      <div className="container mx-auto flex justify-between items-center md:mt-1">
        {/* Logo and Home link */}
        <div className="flex items-center space-x-8">
          <h1 className="text-xl md:ml-10 bg-indigo-800 p-1 rounded text-white font-semibold ml-6">
            Daily-Blogs
          </h1>
          {isAuthenticated && (
            <NavLink
              to="/"
              className={({ isActive }: { isActive: boolean }) =>
                isActive
                  ? "text-pink-500 font-bold text-lg px-4 py-1 rounded-lg"
                  : "text-black text-lg font-bold px-4 py-2 rounded-lg"
              }
            >
              Home
            </NavLink>
          )}
        </div>

        {/* User Menu (Login/Signup or Profile) */}
        <div className="flex items-center space-x-6">
          {!isAuthenticated ? (
            <>
              <NavLink
                to="/login"
                className={({ isActive }: { isActive: boolean }) =>
                  isActive
                    ? "text-blue-500 font-semibold text-lg  px-4 py-2"
                    : "text-white text-lg  px-4 py-2"
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className={({ isActive }: { isActive: boolean }) =>
                  isActive
                    ? "text-blue-500 font-semibold text-lg  px-4 py-2"
                    : "text-white text-lg  px-4 py-2"
                }
              >
                Signup
              </NavLink>
            </>
          ) : (
            <div className="relative md:mr-10" ref={profileMenuRef}>
              <button
                onClick={handleClicked}
                className="text-white bg-indigo-600 text-lg hover:bg-indigo-700 px-4 py-2 rounded-full  flex items-center justify-center"
              >
              <MdAccountCircle  className="text-white w-6 h-8" />
              </button>
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-4 w-55 bg-white shadow-lg rounded-lg">
                  <ProfileMenu closeMenu={() => setProfileMenuOpen(false)} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
