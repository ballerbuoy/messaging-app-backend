const express = require("express"),
  router = express.Router();

const { loginRoutes } = require("./loginRoutes");
const { userRoutes } = require("./userRoutes");
const { chatRoomRoutes } = require("./chatRoomRoutes");

router.use("/login", loginRoutes);
router.use("/user", userRoutes);
router.use("/chatroom", chatRoomRoutes);

const appRoutes = router;
module.exports = { appRoutes };
