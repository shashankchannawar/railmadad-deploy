import express from 'express';
import Complaint from '../models/Complaint.js'; // ✅ updated path

const router = express.Router();

// GET all complaints
router.get('/', async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST update status
router.post('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET complaints by mobile number
router.get('/by-mobile/:mobile', async (req, res) => {
  try {
    const { mobile } = req.params;
    const complaints = await Complaint.find({ mobile });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
