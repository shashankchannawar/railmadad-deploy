import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import {
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Statistics = () => {
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState(null);
  const [error, setError] = useState(null);

  const { BASE_URL, token } = useContext(AuthContext);

  const COLORS = [
    "#16a34a",
    "#dc2626",
    "#ea580c",
    "#ca8a04",
    "#9333ea",
    "#0891b2",
    "#db2777",
    "#65a30d",
    "#4f46e5",
  ];

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${BASE_URL}/api/admins/super-admin/statistics`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setStatistics(response.data.statistics);
      } else {
        setError(response.data.message || "Failed to fetch statistics");
      }
    } catch (err) {
      console.error("Error fetching statistics:", err);
      setError(
        err.response?.data?.message || "Network error while fetching statistics"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <div>
            <h3 className="font-semibold text-red-800">
              Error Loading Statistics
            </h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
        <button
          onClick={fetchStatistics}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const categoryData = Object.entries(
    statistics?.categoryWiseComplaints || {}
  ).map(([category, count]) => ({
    name: category,
    value: count,
  }));

  const statusData = [
    {
      name: "Pending",
      value: statistics?.pendingComplaints || 0,
      fill: "#ea580c",
    },
    {
      name: "Resolved",
      value: statistics?.resolvedComplaints || 0,
      fill: "#16a34a",
    },
  ];

  const completionRate =
    statistics?.totalComplaints > 0
      ? (
          (statistics?.resolvedComplaints / statistics?.totalComplaints) *
          100
        ).toFixed(1)
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-green-100 rounded-lg">
          <BarChart3 className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Statistics Dashboard
          </h1>
          <p className="text-gray-600">
            Overview of complaint management performance
          </p>
        </div>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Total Complaints
              </p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {statistics?.totalComplaints || 0}
              </h3>
            </div>
            <FileText className="w-10 h-10 text-blue-600 bg-blue-100 p-2 rounded-lg" />
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Resolved Complaints
              </p>
              <h3 className="text-2xl font-bold text-green-600 mt-1">
                {statistics?.resolvedComplaints || 0}
              </h3>
            </div>
            <CheckCircle className="w-10 h-10 text-green-600 bg-green-100 p-2 rounded-lg" />
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Pending Complaints
              </p>
              <h3 className="text-2xl font-bold text-orange-600 mt-1">
                {statistics?.pendingComplaints || 0}
              </h3>
            </div>
            <Clock className="w-10 h-10 text-orange-600 bg-orange-100 p-2 rounded-lg" />
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Completion Rate
              </p>
              <h3 className="text-2xl font-bold text-indigo-600 mt-1">
                {completionRate}%
              </h3>
            </div>
            <TrendingUp className="w-10 h-10 text-indigo-600 bg-indigo-100 p-2 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-green-600" /> Complaint Status
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                label
              >
                {statusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={statusData[index].fill || COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" /> Category Wise
            Complaints
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
