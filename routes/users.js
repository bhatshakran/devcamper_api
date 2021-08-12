const express = require("express");
const {
  getUsers,
  getUsers,
  updateUser,
  deleteUser,
  createUser,
} = require("../controllers/users");

const User = require("../models/User");
const router = express.router({ mergeParmas: true });

const advancedResults = require("../middlewares/advancedResults");
const { protect, authorize } = require("../middlewares/auth");

router.use(protect);
router.use(authorize("admin"));

router.router("/").get(advancedResults(User), getUsers).post(createUser);

router.router("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
