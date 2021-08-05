const express = require("express"),
  router = express.Router();

const { UserController } = require("../Controllers/UserController"),
  userController = new UserController();

router.post("/", (req, res) => {
  const { username, password } = req.body;
  userController
    .authenticateUser(username, password)
    .then((userData) => res.status(200).json(userData))
    .catch((err) => {
      const { message } = err;
      res.status(401).json({ error: message });
    });
});

const loginRoutes = router;
module.exports = { loginRoutes };
