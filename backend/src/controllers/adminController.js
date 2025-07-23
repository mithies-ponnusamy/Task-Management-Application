const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Counter = require('../models/Counter');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

// @desc    Create a user
// @route   POST /api/admin/users
// @access  Private/Admin
const createUser = asyncHandler(async (req, res) => {
  const {
    name,
    username,
    email,
    password,
    role,
    phone,
    gender,
    dob,
    department,
    team,
    status,
    employeeType,
    location,
    address,
    about,
    profileImg
  } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    username,
    email,
    password,
    role: role || 'user',
    phone,
    gender,
    dob,
    department,
    team,
    status: status || 'active',
    employeeType,
    location,
    address,
    about,
    profileImg
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      numericalId: user.numericalId,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
      phone: user.phone,
      gender: user.gender,
      dob: user.dob,
      department: user.department,
      team: user.team,
      employeeType: user.employeeType,
      location: user.location,
      address: user.address,
      about: user.about,
      profileImg: user.profileImg
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    user.phone = req.body.phone || user.phone;
    user.gender = req.body.gender || user.gender;
    user.dob = req.body.dob || user.dob;
    user.department = req.body.department || user.department;
    user.team = req.body.team || user.team;
    user.status = req.body.status || user.status;
    user.employeeType = req.body.employeeType || user.employeeType;
    user.location = req.body.location || user.location;
    user.address = req.body.address || user.address;
    user.about = req.body.about || user.about;
    user.profileImg = req.body.profileImg || user.profileImg;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      numericalId: updatedUser.numericalId,
      name: updatedUser.name,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      status: updatedUser.status,
      phone: updatedUser.phone,
      gender: updatedUser.gender,
      dob: updatedUser.dob,
      department: updatedUser.department,
      team: updatedUser.team,
      employeeType: updatedUser.employeeType,
      location: updatedUser.location,
      address: updatedUser.address,
      about: updatedUser.about,
      profileImg: updatedUser.profileImg
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  // Use findByIdAndDelete instead of findById then user.remove()
  const user = await User.findByIdAndDelete(req.params.id);

  if (user) {
    res.json({ message: 'User removed successfully' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});


module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser
};