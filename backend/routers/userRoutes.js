const express = require("express");
const multer = require("multer");

const authMiddleware = require("../middlewares/authMiddleware");

const {
  registerController,
  loginController,
  requestToChangeTypeController,
  sendProblemController,
  sendAllProblemsController,
  sendAllProblemsWorkerController,
  fileDownloadController,
  changeStatusController,
} = require("../controllers/userController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.post("/register", registerController);

router.post("/login", loginController);

router.post(
  "/requestchangeusertype/:userId",
  authMiddleware,
  requestToChangeTypeController
);

router.post("/sendcomplaint", upload.single("file"), authMiddleware, sendProblemController)

router.get('/allproblems', authMiddleware, sendAllProblemsController)

router.get('/worker/allproblems', authMiddleware, sendAllProblemsWorkerController)

router.get('/worker/getfiledownload', authMiddleware, fileDownloadController)

router.post('/worker/changestatus/:problemId', authMiddleware, changeStatusController)

module.exports = router;
