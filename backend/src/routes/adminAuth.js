import express from 'express';
import { createAdmin, 
    deleteAdmin, 
    getActivityLogs, 
    getAdminById, 
    getAllAdmins, 
    getStatistics, 
    resetAdminPassword, 
    superAdminLogin, 
    toggleAdminStatus, 
    updateAdmin } from '../controller/authController.js';

const router = express.Router();

router.post('/super-admin/login', superAdminLogin);  // ✅ connected properly
router.post('/super-admin/create-admin', createAdmin);
router.get('/super-admin/admins', getAllAdmins);
router.get('/super-admin/admins/:id', getAdminById);
router.put('/super-admin/admins/:id', updateAdmin);
router.delete('/super-admin/admins/:id', deleteAdmin);
router.patch('/super-admin/admins/:id/toggle-status', toggleAdminStatus);
router.patch('/super-admin/admins/:id/reset-password', resetAdminPassword);
router.get('/super-admin/statistics', getStatistics);
router.get('/super-admin/activity-logs', getActivityLogs);

export default router;
