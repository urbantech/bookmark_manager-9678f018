import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AINativeProvider } from '@ainative/react-sdk';
import axios from 'axios';

import BookmarkManagement from './components/BookmarkManagement';
import TagSystem from './components/TagSystem';
import Dashboard from './components/Dashboard';
import FilterByTag from './components/FilterByTag';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('ainative_token') || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setLoading(true);
      const storedToken = localStorage.getItem('ainative_token');
      if (storedToken) {
        setToken(storedToken);
      }
      setLoading(false);
    }
  }, [token]);

  const handleLogin = async (credentials) => {
    setLoading(true);
    try {
      const response = await axios.post('https://api.ainative.studio/api/v1/auth/login', credentials);
      const accessToken = response.data.access_token;
      localStorage.setItem('ainative_token', accessToken);
      setToken(accessToken);
    } catch (err) {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ainative_token');
    setToken('');
  };

  return (
    <AINativeProvider apiKey={process.env.REACT_APP_AINATIVE_API_KEY || ''}>
      <Router>
        <header className="bg-dark-navy text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">Bookmark Manager</h1>
            <nav>
              <ul className="flex space-x-4">
                {token ? (
                  <>
                    <li><Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link></li>
                    <li><Link to="/bookmarks" className="hover:text-gray-300">Bookmarks</Link></li>
                    <li><Link to="/tags" className="hover:text-gray-300">Tags</Link></li>
                    <li><Link to="/filter" className="hover:text-gray-300">Filter</Link></li>
                    <li><button onClick={handleLogout} className="hover:text-gray-300">Logout</button></li>
                  </>
                ) : (
                  <li><Link to="/login" className="hover:text-gray-300">Login</Link></li>
                )}
              </ul>
            </nav>
          </div>
        </header>
        <main className="container mx-auto mt-8">
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <Routes>
            {!token && (
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
            )}
            {token && (
              <>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/bookmarks" element={<BookmarkManagement />} />
                <Route path="/tags" element={<TagSystem />} />
                <Route path="/filter" element={<FilterByTag />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </>
            )}
            {!token && (
              <Route path="*" element={<Navigate to="/login" replace />} />
            )}
          </Routes>
        </main>
      </Router>
    </AINativeProvider>
  );
};

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl mb-6 font-bold">Login</h2>
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
        <input 
          type="email" 
          id="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-6">
        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
        <input 
          type="password" 
          id="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="flex items-center justify-between">
        <button 
          type="submit" 
          className="bg-dark-navy hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Sign In
        </button>
      </div>
    </form>
  );
};

export default App;