import express from "express";
import axios from "axios";  // Import axios
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import railInfoRoutes from './routes/railInfoRoutes.js'
import connectDB from './config/db.js';
import complaintRoutes from './routes/complaintRoutes.js';
import adminIssuesRoute from './routes/adminIssues.js'
import adminAuth from './routes/adminAuth.js'
import categoryAdmin from './routes/categoryAdmin.js'

const app = express();
const port = process.env.PORT || 5001;

app.use(express.json());  
app.use(cors()); 


app.use('/api', railInfoRoutes);

connectDB();

app.use('/api/complaints', complaintRoutes);
app.use('/api/admin-issues', adminIssuesRoute);
app.use('/api/admins',adminAuth)
app.use('/api/category-admins', categoryAdmin)

app.post("/api/chatbot", async (req, res) => {
  const message = req.body.message;  

  try {
   
    const response = await axios.post("http://127.0.0.1:5000/api", {
      message: message,
    });

    res.json({ response: response.data.response });
  } catch (error) {
    console.error("Error connecting to Python server:", error);
    res.status(500).json({ response: "Error connecting to the Python server." });
  }

});


console.log('Cloudinary config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


app.listen(port, () => {
  console.log(`Node.js server is running on port ${port}`);
});
