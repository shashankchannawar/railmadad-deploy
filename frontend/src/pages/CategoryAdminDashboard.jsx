import React, { useState, useEffect, useContext } from "react";
import {
  Train,
  LogOut,
  Bell,
  Search,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  User,
  Shield,
  X as CloseIcon,
  Edit,
  Save,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

// ✅ Updated categories and colors
const categoryColors = {
  "Medical Emergency": {
    gradient: "from-red-700 to-red-600",
    button: "red-600",
    hover: "red-700",
    border: "red-600",
    text: "red-800",
  },
  "Facility Cleaning": {
    gradient: "from-green-700 to-green-600",
    button: "green-600",
    hover: "green-700",
    border: "green-600",
    text: "green-800",
  },
  "Coach Maintenance": {
    gradient: "from-blue-700 to-blue-600",
    button: "blue-600",
    hover: "blue-700",
    border: "blue-600",
    text: "blue-800",
  },
  "Food Services": {
    gradient: "from-orange-700 to-orange-600",
    button: "orange-600",
    hover: "orange-700",
    border: "orange-600",
    text: "orange-800",
  },
  "Emergency Services": {
    gradient: "from-red-800 to-red-700",
    button: "red-700",
    hover: "red-800",
    border: "red-700",
    text: "red-900",
  },
  Safety: {
    gradient: "from-yellow-700 to-yellow-600",
    button: "yellow-600",
    hover: "yellow-700",
    border: "yellow-600",
    text: "yellow-800",
  },
  "Operational Issues": {
    gradient: "from-indigo-700 to-indigo-600",
    button: "indigo-600",
    hover: "indigo-700",
    border: "indigo-600",
    text: "indigo-800",
  },
  "Seat Issues": {
    gradient: "from-pink-700 to-pink-600",
    button: "pink-600",
    hover: "pink-700",
    border: "pink-600",
    text: "pink-800",
  },
  Others: {
    gradient: "from-gray-700 to-gray-600",
    button: "gray-600",
    hover: "gray-700",
    border: "gray-600",
    text: "gray-800",
  },
  default: {
    gradient: "from-slate-700 to-slate-600",
    button: "slate-600",
    hover: "slate-700",
    border: "slate-600",
    text: "slate-800",
  },
};

export default function CategoryAdminDashboard() {
  const { user, logout, BASE_URL } = useContext(AuthContext);
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [trainDetails, setTrainDetails] = useState(null);
  const [loadingTrainDetails, setLoadingTrainDetails] = useState(false);
  const [editingStatus, setEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const category = user?.category || "Others";
  const colors = categoryColors[category] || categoryColors.default;

  useEffect(() => {
    fetchComplaints();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, statusFilter, priorityFilter, complaints]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/api/category-admins/complaints`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.success) {
        setComplaints(response.data.complaints);
        calculateStats(response.data.complaints);
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
      toast.error("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  const fetchTrainDetails = async (pnr) => {
    try {
      setLoadingTrainDetails(true);
      // Using dummy data for now
      // Real API: https://pnrapi.com/api/pnr/${pnr}
      
      // Dummy train details
      const dummyData = {
        success: true,
        data: {
          pnr: pnr,
          trainNumber: "12345",
          trainName: "Shatabdi Express",
          from: "New Delhi",
          to: "Mumbai Central",
          dateOfJourney: "2024-01-20",
          boardingStation: "New Delhi",
          reservationUpto: "Mumbai Central",
          class: "3A",
          passengers: [
            {
              number: 1,
              currentStatus: "CNF",
              bookingStatus: "CNF",
              coach: "A1",
              berth: 45
            }
          ],
          chartStatus: "Chart Prepared"
        }
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTrainDetails(dummyData.data);
    } catch (error) {
      console.error("Error fetching train details:", error);
      toast.error("Failed to fetch train details");
    } finally {
      setLoadingTrainDetails(false);
    }
  };

  const calculateStats = (data) => {
    setStats({
      total: data.length,
      pending: data.filter((c) => c.status === "Pending").length,
      inProgress: data.filter((c) => c.status === "In Progress").length,
      resolved: data.filter((c) => c.status === "Resolved").length,
    });
  };

  const applyFilters = () => {
    let filtered = [...complaints];
    if (searchQuery) {
      filtered = filtered.filter(
        (c) =>
          c.complaintId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.pnr?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (statusFilter !== "all")
      filtered = filtered.filter((c) => c.status === statusFilter);
    if (priorityFilter !== "all")
      filtered = filtered.filter((c) => c.priority === priorityFilter);
    setFilteredComplaints(filtered);
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/category-admin");
  };

  const handleViewComplaint = (complaint) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.status);
    setEditingStatus(false);
    setShowModal(true);
    if (complaint.pnr) {
      fetchTrainDetails(complaint.pnr);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/api/complaints/${selectedComplaint._id}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.success) {
        toast.success("Status updated successfully");
        setEditingStatus(false);
        fetchComplaints();
        setSelectedComplaint({ ...selectedComplaint, status: newStatus });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "text-red-600 bg-red-50 border-red-200";
      case "Medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Low":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "In Progress":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "Resolved":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-semibold">Loading complaints...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Government Header */}
      <div className="bg-white shadow-lg border-b-4 border-green-600">
        {/* Top Bar */}
        <div className="bg-green-800 text-white py-2">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <span>📞 Helpline: 139</span>
              <span className="hidden sm:inline">✉️ support@railmadad.gov.in</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-semibold">Admin Portal</span>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-green-600 p-3 rounded-lg flex items-center justify-center">
                <Train className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-green-800">
                  {category} Admin Dashboard
                </h1>
                <p className="text-sm text-gray-600">रेल मदद - Railway Grievance Portal</p>
              </div>
            </div>

            {/* User Info & Logout */}
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right">
                <p className="text-sm font-semibold text-gray-800">{user?.email}</p>
                <p className="text-xs text-gray-500">{category}</p>
              </div>
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Government Strip */}
        <div className="bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <span className="w-6 h-4 bg-orange-500 rounded-sm"></span>
              <span className="w-6 h-4 bg-white border rounded-sm"></span>
              <span className="w-6 h-4 bg-green-600 rounded-sm"></span>
              <span className="ml-2 text-xs sm:text-sm">Government of India | Ministry of Railways</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
          {[
            { label: "Total Complaints", count: stats.total, icon: AlertCircle, color: "purple" },
            { label: "Pending", count: stats.pending, icon: Clock, color: "yellow" },
            { label: "In Progress", count: stats.inProgress, icon: User, color: "blue" },
            { label: "Resolved", count: stats.resolved, icon: CheckCircle, color: "green" },
          ].map((stat, i) => (
            <div
              key={i}
              className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-${stat.color}-500 hover:shadow-lg transition`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{stat.count}</p>
                </div>
                <div className={`bg-${stat.color}-100 p-3 rounded-full`}>
                  <stat.icon className={`w-8 h-8 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Search & Filters */}
        <section className="flex flex-col sm:flex-row gap-4 px-6">
          <div className="relative flex-1">
            <Search className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search complaints..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </section>

        {/* Complaints Table */}
        <section className="p-6">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Complaint ID</th>
                    <th className="py-3 px-4 text-xs font-semibold text-gray-600 uppercase">PNR</th>
                    <th className="py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Priority</th>
                    <th className="py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Date</th>
                    <th className="py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComplaints.length > 0 ? (
                    filteredComplaints.map((c) => (
                      <tr key={c._id} className="border-t hover:bg-gray-50 transition">
                        <td className="py-3 px-4 font-medium text-gray-900">{c.complaintId}</td>
                        <td className="py-3 px-4 text-gray-700">{c.pnr}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(c.status)}`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(c.priority)}`}>
                            {c.priority}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-500 text-sm">
                          {new Date(c.createdAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleViewComplaint(c)}
                            className="flex items-center gap-2 text-green-600 hover:text-green-800 font-medium text-sm"
                          >
                            <Eye className="w-4 h-4" /> View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-8">
                        <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                        <p className="text-gray-500 font-medium">No complaints found</p>
                        <p className="text-sm text-gray-400">Try adjusting your filters</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      {/* Complaint Detail Modal */}
      {showModal && selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-green-600 text-white p-6 rounded-t-xl flex items-center justify-between">
              <h2 className="text-2xl font-bold">Complaint Details</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setTrainDetails(null);
                }}
                className="text-white hover:bg-green-700 p-2 rounded-lg transition"
              >
                <CloseIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Complaint Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Complaint Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Complaint ID</p>
                    <p className="font-semibold text-gray-900">{selectedComplaint.complaintId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Category</p>
                    <p className="font-semibold text-gray-900">{selectedComplaint.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">PNR Number</p>
                    <p className="font-semibold text-gray-900">{selectedComplaint.pnr}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Priority</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(selectedComplaint.priority)}`}>
                      {selectedComplaint.priority}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    {editingStatus ? (
                      <div className="flex items-center gap-2">
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-green-500"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                        <button
                          onClick={handleStatusUpdate}
                          className="bg-green-600 text-white p-1 rounded hover:bg-green-700"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingStatus(false);
                            setNewStatus(selectedComplaint.status);
                          }}
                          className="bg-gray-400 text-white p-1 rounded hover:bg-gray-500"
                        >
                          <CloseIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(selectedComplaint.status)}`}>
                          {selectedComplaint.status}
                        </span>
                        <button
                          onClick={() => setEditingStatus(true)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Submitted On</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(selectedComplaint.createdAt).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Description</p>
                  <p className="text-gray-900 mt-1">{selectedComplaint.complaintText || 'No description provided'}</p>
                </div>
              </div>

              {/* Train Details */}
              {selectedComplaint.pnr && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Train Details</h3>
                  {loadingTrainDetails ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                      <p className="text-sm text-gray-600 mt-2">Loading train details...</p>
                    </div>
                  ) : trainDetails ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Train Number</p>
                          <p className="font-semibold text-gray-900">{trainDetails.trainNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Train Name</p>
                          <p className="font-semibold text-gray-900">{trainDetails.trainName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">From</p>
                          <p className="font-semibold text-gray-900">{trainDetails.from}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">To</p>
                          <p className="font-semibold text-gray-900">{trainDetails.to}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Date of Journey</p>
                          <p className="font-semibold text-gray-900">{trainDetails.dateOfJourney}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Class</p>
                          <p className="font-semibold text-gray-900">{trainDetails.class}</p>
                        </div>
                      </div>
                      
                      {/* Passenger Details */}
                      {trainDetails.passengers && trainDetails.passengers.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-semibold text-gray-700 mb-2">Passenger Details</p>
                          <div className="bg-white rounded p-3">
                            {trainDetails.passengers.map((passenger, idx) => (
                              <div key={idx} className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Passenger {passenger.number}</span>
                                <span className="font-semibold text-gray-900">
                                  {passenger.currentStatus} | Coach: {passenger.coach} | Berth: {passenger.berth}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-600 text-sm">Unable to fetch train details</p>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setTrainDetails(null);
                }}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}