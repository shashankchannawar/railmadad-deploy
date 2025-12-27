import Complaint from '../models/Complaint.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';

// ✅ Login
export const categoryAdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) return res.status(404).json({ success: false, message: 'Admin not found' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid credentials' });

    const token = jwt.sign(
      {
        id: admin._id,
        role: "category_admin", // ✅ consistent with frontend
        category: admin.category, // ✅ comes from your DB
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.status(200).json({ success: true, token, admin, role: "category_admin", // ✅ include role here
        category: admin.category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Logout
export const categoryAdminLogout = async (req, res) => {
  try {
    // If using cookies:
    res.clearCookie('token');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Profile
export const getProfile = async (req, res) => {
  try {
    const admin = await CategoryAdmin.findById(req.user.id).select('-password');
    res.status(200).json({ success: true, admin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const admin = await CategoryAdmin.findByIdAndUpdate(req.user.id, updates, { new: true });
    res.status(200).json({ success: true, admin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Complaints
export const getAssignedComplaints = async (req, res) => {
  try {
    const category = req.user.category;
    const complaints = await Complaint.find({ category });
    res.status(200).json({ success: true, complaints });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(id, { status }, { new: true });
    res.status(200).json({ success: true, complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Statistics
export const getCategoryStatistics = async (req, res) => {
  try {
    const department = req.user.department;
    const total = await Complaint.countDocuments({ department });
    const resolved = await Complaint.countDocuments({ department, status: 'Resolved' });
    const pending = await Complaint.countDocuments({ department, status: 'Pending' });

    res.status(200).json({
      success: true,
      stats: { total, resolved, pending }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
