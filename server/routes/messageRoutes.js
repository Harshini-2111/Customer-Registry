const express = require("express");
const router = express.Router();
const { getMessages, sendMessage } = require("../controllers/messageController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.route("/:complaintId").get(getMessages).post(sendMessage);

module.exports = router;
