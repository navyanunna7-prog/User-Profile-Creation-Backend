const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  uploadAvatar,
  uploadCover,
  deleteAvatar,
  searchUsers,
} = require("../controllers/userController");

router.route("/").get(getUsers).post(createUser);
// IMPORTANT: /search must be declared before /:id, or Express will treat
// "search" as an :id value and searchUsers will never be reached.
router.route("/search").get(searchUsers);
router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);
router.route("/:id/avatar").put(upload.single("avatar"), uploadAvatar).delete(deleteAvatar);
router.route("/:id/cover").put(upload.single("cover"), uploadCover);

module.exports = router;