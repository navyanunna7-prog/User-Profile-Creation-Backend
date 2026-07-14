const path = require("path");
const fs = require("fs");
const User = require("../models/User");

// @desc Get all users
// @route GET /api/users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc Search users by name, username, or email
// @route GET /api/users/search?q=keyword
exports.searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) {
      return res.status(400).json({ error: "Search query 'q' is required" });
    }
    const regex = new RegExp(q.trim(), "i"); // case-insensitive partial match
    const users = await User.find({
      $or: [{ name: regex }, { username: regex }, { email: regex }],
    }).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc Get single user
// @route GET /api/users/:id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc Create a new user
// @route POST /api/users
exports.createUser = async (req, res) => {
  try {
    const { name, email, age, username, website, bio } = req.body;
    const user = await User.create({ name, email, age, username, website, bio });
    res.status(201).json(user);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(400).json({ error: error.message });
  }
};

// @desc Update a user (profile fields: username, website, bio, name, email, age)
// @route PUT /api/users/:id
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(400).json({ error: error.message });
  }
};

// @desc Delete a user
// @route DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper to remove an old uploaded file from disk (ignores missing files)
const removeOldFile = (fileUrl) => {
  if (!fileUrl) return;
  const filename = fileUrl.split("/uploads/")[1];
  if (!filename) return;
  const filePath = path.join(__dirname, "..", "uploads", filename);
  fs.unlink(filePath, () => {});
};

// @desc Upload/replace a user's avatar photo
// @route PUT /api/users/:id/avatar
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    removeOldFile(user.avatarUrl);
    user.avatarUrl = `/uploads/${req.file.filename}`;
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc Upload/replace a user's cover photo
// @route PUT /api/users/:id/cover
exports.uploadCover = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    removeOldFile(user.coverUrl);
    user.coverUrl = `/uploads/${req.file.filename}`;
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc Delete a user's avatar photo
// @route DELETE /api/users/:id/avatar
exports.deleteAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    removeOldFile(user.avatarUrl);
    user.avatarUrl = "";
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};