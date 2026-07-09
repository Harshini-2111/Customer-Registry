const express = require("express");
const router = express.Router();
const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
} = require("../controllers/complaintController");
const { protect, requireRole } = require("../middleware/auth");

router.use(protect);

router.route("/").post(createComplaint).get(requireRole("agent", "admin"), getAllComplaints);
router.get("/my", getMyComplaints);
router
  .route("/:id")
  .get(getComplaintById)
  .put(requireRole("agent", "admin"), updateComplaint)
  .delete(deleteComplaint);

module.exports = router;
