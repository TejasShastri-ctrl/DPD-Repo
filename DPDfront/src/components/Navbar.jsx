import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FaSignOutAlt } from 'react-icons/fa';
import { HiOutlineLogout } from 'react-icons/hi';
import { MdLogout } from 'react-icons/md';
import { logoutUser } from '../Redux/Auth/AuthSlice';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login', { replace: true });
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 shadow-md sticky top-0 z-50">
      <div className="flex items-center justify-between">
        {/* Left - Logo and Links */}
        <div className="flex items-center space-x-10">
          <div className="text-xl font-bold">DigitalProductDefinition</div>
          <ul className="flex space-x-6 text-sm font-medium">
            <li className="hover:text-gray-300 cursor-pointer">
              <Link to="/">Homepage</Link>
            </li>
            <li className="hover:text-gray-300 cursor-pointer">
              <Link to="/about">Project info</Link>
            </li>
          </ul>
        </div>

        {/* Right - Profile Icon triggers logout */}
        <div
          className="text-2xl cursor-pointer hover:text-gray-300"
          onClick={handleLogout}
          title="Logout"
          aria-label="Logout"
        >
          <FaSignOutAlt className="text-red-600 text-xl" />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
