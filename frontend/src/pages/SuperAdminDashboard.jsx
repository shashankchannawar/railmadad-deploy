// pages/SuperAdminDashboard.jsx
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  LogOut,
  UserPlus,
  Settings,
  BarChart3
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const SuperAdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalAdmins: 0,
    totalComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0
  });
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   fetchStats();
  // }, []);

  // const fetchStats = async () => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     const response = await axios.get('http://localhost:5000/api/super-admin/statistics', {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
      
  //     if (response.data.success) {
  //       setStats(response.data.statistics);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching stats:', error);
  //     toast.error('Failed to load statistics');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleLogout = () => {
    navigate('/superadmin');
    logout();
    toast.success('Logged out successfully', {
          duration: 3000, style: {
            background: '#fff',       // No background
            color: '#111827',                 // Dark text color (Tailwind gray-900)
            fontWeight: 'bold',
            borderRadius: '0.5rem',
            padding: '1rem',
            borderBottom: '4px solid #22c55e', // Greenish bottom border
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          },
        });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-4 border-green-600">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-green-600 p-3 rounded-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-green-800">Super Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome, {user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Admins */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Admins</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {loading ? '...' : stats.totalAdmins}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Total Complaints */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Complaints</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {loading ? '...' : stats.totalComplaints}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Pending</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {loading ? '...' : stats.pendingComplaints}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Resolved */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Resolved</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {loading ? '...' : stats.resolvedComplaints}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Manage Admins */}
          <button
            onClick={() => navigate('/super-admin/admins')}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-4 rounded-lg group-hover:bg-blue-200 transition">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-gray-800">Manage Admins</h3>
                <p className="text-sm text-gray-600">View and manage category admins</p>
              </div>
            </div>
          </button>

          {/* Create Admin */}
          <button
            onClick={() => navigate('/super-admin/create-admin')}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-4 rounded-lg group-hover:bg-green-200 transition">
                <UserPlus className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-gray-800">Create Admin</h3>
                <p className="text-sm text-gray-600">Add new category admin</p>
              </div>
            </div>
          </button>

          {/* View Statistics */}
          <button
            onClick={() => navigate('/super-admin/statistics')}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-4 rounded-lg group-hover:bg-purple-200 transition">
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-gray-800">View Statistics</h3>
                <p className="text-sm text-gray-600">Detailed analytics and reports</p>
              </div>
            </div>
          </button>

          {/* Activity Logs */}
          <button
            onClick={() => navigate('/super-admin/activity-logs')}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-4 rounded-lg group-hover:bg-orange-200 transition">
                <FileText className="w-8 h-8 text-orange-600" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-gray-800">Activity Logs</h3>
                <p className="text-sm text-gray-600">View admin activity history</p>
              </div>
            </div>
          </button>

          {/* Settings */}
          <button
            onClick={() => navigate('/super-admin/settings')}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 p-4 rounded-lg group-hover:bg-gray-200 transition">
                <Settings className="w-8 h-8 text-gray-600" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-gray-800">Settings</h3>
                <p className="text-sm text-gray-600">System configuration</p>
              </div>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
};

export default SuperAdminDashboard;