const express = require("express");
const auth = require("../middleware/authorization");

const userRouter = express.Router();
const {
  createUser,
  loginUser,
  verifyUser,
  getAllUsers,
  updateUserById,
  logout,
} = require("../controllers/user.controller");

userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/verifytoken", auth, verifyUser);
userRouter.get("/allUsers", getAllUsers);
userRouter.put("/update/:id", auth, updateUserById);
userRouter.post("/logout", logout);

module.exports = userRouter;
