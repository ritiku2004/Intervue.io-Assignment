import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { logout } from '../../features/auth/authSlice';
import { toast } from 'react-hot-toast';

const Header = () => {
  const { isAuthenticated, user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully.');
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to={isAuthenticated ? "/dashboard" : "/"} className="text-2xl font-bold text-primary">
              LivePoll
            </Link>
          </div>
          {isAuthenticated && (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 hidden sm:block">
                Welcome, {user?.name || 'Teacher'}!
              </span>
              <button 
                onClick={handleLogout} 
                className="font-semibold text-primary hover:text-primary-light"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;