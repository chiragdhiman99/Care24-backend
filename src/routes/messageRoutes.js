const express = require("express");
const router = express.Router();
const upload  = require("../middleware/uploads");

const {
  createMessage,
  getMessagesbyId,
  getunreadcounts,
} = require("../controllers/messageController");

router.post("/create", createMessage);
router.get("/get/:id", getMessagesbyId);
router.get("/unread/:conversationId", getunreadcounts);

router.post("/image", upload.single("file"), (req, res) => {
  res.status(200).json({
    fileUrl: `/uploads/${req.file.filename}`,
    fileType: req.file.mimetype.startsWith("image") ? "image" : "pdf",
  });
});

module.exports = router;
