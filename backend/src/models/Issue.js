import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema(
  {
    mobile: String,
    pnr: String,
    date: Date,
    complaintText: String,
    imagePath: String,
    status: { type: String, default: 'Pending' },
    categories: String,
    category: String,
    priority: String,
    severity: String,
  },
  { timestamps: true }
);

const Issue = mongoose.model('Issue', issueSchema);
export default Issue;
