import Complaint from '../models/Complaint.js';
import { processQuery } from '../utils/runML.js';

export const submitComplaint = async (req, res) => {
  try {
    const { mobile, email, pnr, date, complaintText } = req.body;
    const imagePath = req.file ? req.file.path : null;

    const complaint = new Complaint({ mobile, email, pnr, date, complaintText, imagePath });
    
    // Save first to generate the _id
    await complaint.save();
    
    // Now generate complaintId using the saved _id
    const uniquePart = complaint._id.toString().slice(-6);
    complaint.complaintId = `CMP-${uniquePart}`;

    // Process ML
    const ml = await processQuery(complaintText);

    Object.assign(complaint, {
      category: ml.Dominant_Category,
      categories: ml.Categories,
      priority: ml.Priority,
      severity: ml.Severity,
      sentiment: ml.Sentiment_Label,
      sentimentScore: ml.Sentiment_Confidence,
    });
    
    // Save again with all the updated fields
    await complaint.save();

    res.status(201).json({
      message: 'Complaint submitted and processed',
      ml_result: ml,
      complaintId: complaint.complaintId,
    });
  } catch (err) {
    console.error('ML Processing Error:', err);
    res.status(500).json({ error: 'Complaint submission failed' });
  }
};