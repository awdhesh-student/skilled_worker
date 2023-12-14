const express = require("express");
const {
  allUserControllers,
  changeTypeUserController,
  getAllWorksWithWorkersController,
  selectWorkerController,
} = require("../controllers/adminController");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/getallusers", authMiddleware, allUserControllers);

router.post("/changetype/:userId", authMiddleware, changeTypeUserController);

router.get("/getallworks", authMiddleware, getAllWorksWithWorkersController)

router.post("/selectworker/:problemId", authMiddleware, selectWorkerController)

module.exports = router;
