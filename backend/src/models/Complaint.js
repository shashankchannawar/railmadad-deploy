import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  complaintId: {
      type: String,
      unique: true,
    },
  mobile: {
    type: String,
    required: true,
    trim: true,
  },
  email: {                 
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
  pnr: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  complaintText: {
    type: String,
    required: true,
    trim: true,
  },
  imagePath: {
    type: String,
    default: null,
  },
  category: {
    type: String,
  },
  categories: {
    type: String,
  },
  priority: {
    type: String,
  },
  severity: {
    type: String,
  },
  sentiment: {
    type: String,
  },
  sentimentScore: {
    type: Number,
  },
  status: {
    type: String,
    enum: ['Pending', 'In Process', 'Completed'],
    default: 'Pending',
  },
}, { timestamps: true });

const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint;
