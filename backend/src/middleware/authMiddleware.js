import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js"; // or CategoryAdmin if separate

export const protectCategoryAdmin = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach admin to req.user
      const admin = await Admin.findById(decoded.id).select("-password");
      if (!admin) {
        return res
          .status(401)
          .json({ success: false, message: "Admin not found" });
      }

      req.user = admin;
      
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ success: false, message: "Not authorized" });
    }
  } else {
    res.status(401).json({ success: false, message: "No token provided" });
  }
};
