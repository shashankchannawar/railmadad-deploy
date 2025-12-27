import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  
  password: {
    type: String,
    required: true
  },
  
  category: {
    type: String,
    enum: [
      'Medical Emergency',
      'Facility Cleaning',
      'Coach Maintenance',
      'Food Services',
      'Emergency Services',
      'Safety',
      'Operational Issues',
      'Seat Issues',
      'Others'
    ],
    required: true
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  },
  
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;