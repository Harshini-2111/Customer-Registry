const Complaint = require("../models/Complaint");

// @desc  Create complaint
// @route POST /api/complaints
const createComplaint = async (req, res) => {
  try {
    const { subject, category, description, priority } = req.body;
    if (!subject || !description) {
      return res.status(400).json({ message: "Subject and description are required" });
    }
    const complaint = await Complaint.create({
      user: req.user._id,
      subject,
      category,
      description,
      priority,
    });
    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get complaints of logged-in user
// @route GET /api/complaints/my
const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get all complaints (agent/admin)
// @route GET /api/complaints
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("user", "name email")
      .populate("assignedAgent", "name email")
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get single complaint
// @route GET /api/complaints/:id
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("user", "name email")
      .populate("assignedAgent", "name email");
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    const isOwner = complaint.user._id.toString() === req.user._id.toString();
    const isStaff = ["agent", "admin"].includes(req.user.role);
    if (!isOwner && !isStaff) {
      return res.status(403).json({ message: "Not authorized to view this complaint" });
    }
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Update complaint (status, priority, assignment) - agent/admin
// @route PUT /api/complaints/:id
const updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    const { status, priority, assignedAgent } = req.body;
    if (status) complaint.status = status;
    if (priority) complaint.priority = priority;
    if (assignedAgent) complaint.assignedAgent = assignedAgent;

    const updated = await complaint.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Delete complaint
// @route DELETE /api/complaints/:id
const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    const isOwner = complaint.user.toString() === req.user._id.toString();
    const isStaff = ["agent", "admin"].includes(req.user.role);
    if (!isOwner && !isStaff) {
      return res.status(403).json({ message: "Not authorized to delete this complaint" });
    }

    await complaint.deleteOne();
    res.json({ message: "Complaint removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
};
