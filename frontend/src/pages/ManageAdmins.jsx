import { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Users,
  Search,
  Edit,
  Trash2,
  Power,
  Key,
  AlertCircle,
  CheckCircle,
  X,
  Loader,
  Mail,
  Tag,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const ManageAdmins = () => {
  const { token, BASE_URL, logout } = useContext(AuthContext);

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [notification, setNotification] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [editForm, setEditForm] = useState({ email: "", category: "" });
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const categories = [
    "Medical Emergency",
    "Facility Cleaning",
    "Coach Maintenance",
    "Food Services",
    "Emergency Services",
    "Safety",
    "Operational Issues",
    "Seat Issues",
    "Others",
  ];

  // ✅ Fetch admins
  useEffect(() => {
    if (token) fetchAdmins();
  }, [token]);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/admins/super-admin/admins`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setAdmins(response.data.admins);
      } else {
        showNotification("error", response.data.message || "Failed to fetch admins");
      }
    } catch (error) {
      if (error.response?.status === 401) logout();
      showNotification("error", "Network error while fetching admins");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // ✅ Toggle status
  const handleToggleStatus = async (admin) => {
    setActionLoading(true);
    try {
      const response = await axios.patch(
        `${BASE_URL}/api/admins/super-admin/admins/${admin._id}/toggle-status`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        showNotification("success", response.data.message);
        fetchAdmins();
      } else {
        showNotification("error", response.data.message);
      }
    } catch {
      showNotification("error", "Failed to toggle admin status");
    } finally {
      setActionLoading(false);
    }
  };

  // ✅ Edit admin
  const handleEditClick = (admin) => {
    setSelectedAdmin(admin);
    setEditForm({ email: admin.email, category: admin.category });
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
    setActionLoading(true);
    try {
      const response = await axios.put(
        `${BASE_URL}/api/admins/super-admin/admins/${selectedAdmin._id}`,
        editForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        showNotification("success", "Admin updated successfully");
        setShowEditModal(false);
        fetchAdmins();
      } else {
        showNotification("error", response.data.message);
      }
    } catch {
      showNotification("error", "Failed to update admin");
    } finally {
      setActionLoading(false);
    }
  };

  // ✅ Delete admin
  const handleDeleteClick = (admin) => {
    setSelectedAdmin(admin);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setActionLoading(true);
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/admins/super-admin/admins/${selectedAdmin._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        showNotification("success", "Admin deleted successfully");
        setShowDeleteModal(false);
        fetchAdmins();
      } else {
        showNotification("error", response.data.message);
      }
    } catch {
      showNotification("error", "Failed to delete admin");
    } finally {
      setActionLoading(false);
    }
  };

  // ✅ Reset password
  const handleResetPasswordClick = (admin) => {
    setSelectedAdmin(admin);
    setNewPassword("");
    setConfirmPassword("");
    setShowResetPasswordModal(true);
  };

  const handleResetPasswordSubmit = async () => {
    if (newPassword !== confirmPassword) {
      showNotification("error", "Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      showNotification("error", "Password must be at least 6 characters");
      return;
    }

    setActionLoading(true);
    try {
      const response = await axios.patch(
        `${BASE_URL}/api/admins/super-admin/admins/${selectedAdmin._id}/reset-password`,
        { newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        showNotification("success", "Password reset successfully");
        setShowResetPasswordModal(false);
      } else {
        showNotification("error", response.data.message);
      }
    } catch {
      showNotification("error", "Failed to reset password");
    } finally {
      setActionLoading(false);
    }
  };

  // ✅ Filter admins
  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch = admin.email
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      !filterCategory || admin.category === filterCategory;
    const matchesStatus =
      filterStatus === "" ||
      (filterStatus === "active" && admin.isActive) ||
      (filterStatus === "inactive" && !admin.isActive);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Users className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Manage Admins</h1>
            <p className="text-gray-600">View and manage all category admins</p>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={`p-4 rounded-lg flex items-start gap-3 ${
            notification.type === "success"
              ? "bg-green-50 border border-green-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          )}
          <p
            className={`flex-1 font-medium ${
              notification.type === "success"
                ? "text-green-800"
                : "text-red-800"
            }`}
          >
            {notification.message}
          </p>
          <button onClick={() => setNotification(null)}>
            <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Admins Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 text-green-600 animate-spin" />
          </div>
        ) : filteredAdmins.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No admins found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAdmins.map((admin) => (
                  <tr key={admin._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {admin.email}
                    </td>
                    <td className="px-6 py-4">
                      <Tag className="w-4 h-4 text-gray-400 inline-block mr-2" />
                      {admin.category}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          admin.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {admin.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => handleEditClick(admin)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(admin)}
                        className={`p-2 rounded-lg ${
                          admin.isActive
                            ? "text-orange-600 hover:bg-orange-50"
                            : "text-green-600 hover:bg-green-50"
                        }`}
                        disabled={actionLoading}
                      >
                        <Power className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleResetPasswordClick(admin)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                      >
                        <Key className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(admin)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ✏️ Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Edit Admin</h2>
            <input
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              placeholder="Email"
              className="w-full border p-2 rounded mb-3"
            />
            <select
              value={editForm.category}
              onChange={(e) =>
                setEditForm({ ...editForm, category: e.target.value })
              }
              className="w-full border p-2 rounded mb-4"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded"
                disabled={actionLoading}
              >
                {actionLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔑 Reset Password Modal */}
      {showResetPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Reset Password</h2>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border p-2 rounded mb-3"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowResetPasswordModal(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleResetPasswordSubmit}
                className="px-4 py-2 bg-purple-600 text-white rounded"
                disabled={actionLoading}
              >
                {actionLoading ? "Updating..." : "Reset"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🗑️ Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg text-center">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to delete this admin?
            </h2>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded"
                disabled={actionLoading}
              >
                {actionLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAdmins;
