import React, { useState } from 'react';
import Header from '../components/Header';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    console.log('Login successful:', { email, password });
    // Redirect or display a success message here
  };

  return (
    <div className="min-h-screen bg-teal-50 flex flex-col">
      <Header />
      <div className="flex flex-1 justify-center items-center">
        <div className="w-full max-w-sm bg-white p-6 rounded-lg border-2 shadow-lg">
          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700">
            Login
          </h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter Email ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-300 placeholder-gray-400"
              aria-label="Email"
              required
            />
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-300 placeholder-gray-400"
              aria-label="Password"
              required
            />
            <button
              type="submit"
              className="w-full py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-700 transition-all"
            >
              Login
            </button>
            <div className="text-center mt-4 flex items-center justify-center gap-2">
              <p className="text-gray-600">New User? </p>
              <Link
                to="/signup"
                className="text-green-500 hover:underline font-semibold"
              >
                Register Now
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
