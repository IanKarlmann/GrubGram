const Report = require("../models/Report.cjs"); // You'll need to create this model
const jwt = require("jsonwebtoken");
const User = require("../models/User.cjs");

// Create a new report
const createReport = async (req, res) => {
  try {
    // Get auth token from request headers
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided, authorization denied" });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId || decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Get report data from request body
    const { postId, postTitle, postUsername, reason } = req.body;
    
    if (!postId || !reason) {
      return res.status(400).json({ message: "Post ID and reason are required" });
    }
    
    // Create new report
    const newReport = new Report({
      reportedBy: user._id,
      reporterName: user.fullName,
      postId,
      postTitle,
      postUsername,
      reason,
      status: 'pending',
      createdAt: new Date()
    });
    
    // Save report to database
    const savedReport = await newReport.save();
    console.log("New report received:", savedReport); // Console log for admin visibility
    
    res.status(201).json({ message: "Report submitted successfully" });
  } 
  catch (error) {
    console.error("Create report error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all reports (admin only)
const getAllReports = async (req, res) => {
  try {
    // Get auth token from request headers
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided, authorization denied" });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId || decoded.id);
    
    // Check if user is admin
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    // Get reports sorted by date (newest first)
    const reports = await Report.find()
      .sort({ createdAt: -1 });
    
    res.status(200).json(reports);
  } 
  catch (error) {
    console.error("Get reports error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update report status (admin only)
const updateReportStatus = async (req, res) => {
  try {
    // Get auth token
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided, authorization denied" });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId || decoded.id);
    
    // Check if user is admin
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    const { status, adminNotes } = req.body;
    
    const updatedReport = await Report.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        adminNotes,
        reviewedAt: new Date(),
        reviewedBy: user._id
      },
      { new: true }
    );
    
    if (!updatedReport) {
      return res.status(404).json({ message: "Report not found" });
    }
    
    res.status(200).json(updatedReport);
  } 
  catch (error) {
    console.error("Update report error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createReport,
  getAllReports,
  updateReportStatus
};