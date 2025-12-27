import express from "express";
import { spawn } from "child_process";

const router = express.Router();

router.post("/", (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ response: "No input provided" });
  }

  // Spawn a Python process
  const pythonProcess = spawn("python", ["./python_scripts/chatbot.py", message]);

  let responseData = "";

  // Capture data from Python script
  pythonProcess.stdout.on("data", (data) => {
    responseData += data.toString();
  });

  // Handle errors
  pythonProcess.stderr.on("data", (data) => {
    console.error(`Python error: ${data}`);
    res.status(500).json({ response: "Error executing chatbot script" });
  });

  // Send the final response when the process exits
  pythonProcess.on("close", (code) => {
    if (code === 0) {
      try {
        const response = JSON.parse(responseData);
        res.json(response);
      } catch (error) {
        console.error("Error parsing response:", error);
        res.status(500).json({ response: "Error parsing chatbot response" });
      }
    } else {
      res.status(500).json({ response: "Chatbot script exited with an error" });
    }
  });
});

export default router;
