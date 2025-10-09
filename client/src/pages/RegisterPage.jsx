import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, clearError } from '../features/auth/authSlice';
import { toast } from 'react-hot-toast';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // We get the specific error message from the slice now
  const { isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    // Display the specific error message from the backend
    if (error) {
      toast.error(error);
      // Clear the error in the Redux store so it doesn't show up again
      dispatch(clearError());
    }
  }, [error, dispatch]);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      return toast.error('Please fill in all fields.');
    }
    
    // dispatch returns a promise we can check
    const resultAction = await dispatch(registerUser(formData));
    
    // If the registration was successful (fulfilled), show toast and navigate
    if (registerUser.fulfilled.match(resultAction)) {
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    }
    // If it failed, the useEffect will handle showing the toast error.
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800">Create a Teacher Account</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
          />
          <Input
            name="email"
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
          />
          <Input
            name="password"
            type="password"
            placeholder="Password (min. 6 characters)"
            value={formData.password}
            onChange={handleChange}
          />
          <Button type="submit" isLoading={isLoading} fullWidth={true}>
            Create Account
          </Button>
        </form>
        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
