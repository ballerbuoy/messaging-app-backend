const { responseSender } = require("../utils");
const express = require("express"),
  router = express.Router();

const { UserController } = require("../Controllers/UserController"),
  userController = new UserController();

router.post("/", (req, res) => {
  const { username, password } = req.body;
  responseSender(userController.authenticateUser(username, password), res);
});

const loginRoutes = router;
module.exports = { loginRoutes };
