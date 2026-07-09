const Message = require("../models/Message");
const Complaint = require("../models/Complaint");

// @desc  Get all messages for a complaint
// @route GET /api/messages/:complaintId
const getMessages = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.complaintId);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    const isOwner = complaint.user.toString() === req.user._id.toString();
    const isStaff = ["agent", "admin"].includes(req.user.role);
    if (!isOwner && !isStaff) {
      return res.status(403).json({ message: "Not authorized to view these messages" });
    }

    const messages = await Message.find({ complaint: req.params.complaintId })
      .populate("sender", "name role")
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Send a message on a complaint thread
// @route POST /api/messages/:complaintId
const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Message text is required" });

    const complaint = await Complaint.findById(req.params.complaintId);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    const message = await Message.create({
      complaint: req.params.complaintId,
      sender: req.user._id,
      text,
    });

    const populated = await message.populate("sender", "name role");
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getMessages, sendMessage };
