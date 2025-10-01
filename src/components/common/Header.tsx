import { Bell, ChevronDown, LogOut, User as UserIcon } from "lucide-react";
import { User } from "firebase/auth";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

export const Header = ({ user }: { user: User | null }) => {
  const [dropdown, setDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdown(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="border-b border-blue-100 px-6 py-4 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-medium text-gray-900 uppercase tracking-wide">
          Invoice
        </h1>
        <div className="flex items-center space-x-4">
          {/* Notification */}
          <button className="text-gray-400 hover:text-gray-600 bg-white p-4 rounded-full transition">
            <Bell className="w-6 h-6" />
          </button>

          {/* User Menu */}
          <div className="relative" ref={dropdownRef}>
            <div
              className="flex items-center space-x-1 bg-white rounded-[40px] p-3 cursor-pointer "
              onClick={() => setDropdown(!dropdown)}
            >
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {user?.displayName?.charAt(0).toUpperCase() ||
                    user?.email?.charAt(0).toUpperCase() ||
                    "U"}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-100" />
            </div>

            {/* Dropdown */}
            {dropdown && (
              <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-48 z-20">
                <button className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700  transition">
                  <UserIcon className="w-4 h-4 mr-2" />
                  Profile
                </button>

                <button
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                  onClick={() => {
                    logout();
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2 cursor-pointer" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
