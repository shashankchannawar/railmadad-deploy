import express from 'express';
import {
  categoryAdminLogin,
  categoryAdminLogout,
  getAssignedComplaints,
  updateComplaintStatus,
  getProfile,
  updateProfile,
  getCategoryStatistics,
} from '../controller/categoryAdminController.js';
import { protectCategoryAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Auth routes
router.post('/login', categoryAdminLogin);
router.post('/logout', categoryAdminLogout);

// ✅ Profile management
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// ✅ Complaint handling routes
router.get("/complaints", protectCategoryAdmin, getAssignedComplaints); // Get all complaints for that department
router.patch('/complaints/:id/status', updateComplaintStatus); // Update complaint progress/status

// ✅ Dashboard/Statistics
router.get('/statistics', getCategoryStatistics); // Total assigned, resolved, pending, etc.

export default router;
