const express = require("express"),
  router = express.Router();

const { UserController } = require("../Controllers/UserController"),
  userController = new UserController();

router.get("/", (req, res) => {
  userController
    .getUsers()
    .then((data) => res.status(200).json(data))
    .catch((err) => {
      const { code, message } = err;
      res.status(code).json({ error: message });
    });
});

router.get("/:userId", (req, res) => {
  const userId = req.params.userId;
  userController
    .getUsers(userId)
    .then((data) => res.status(200).json(data))
    .catch((err) => {
      const { code, message } = err;
      res.status(code || 500).json({ error: message });
    });
});

router.get("/query/:queryString", (req, res) => {
  const queryString = req.params.queryString;
  userController
    .getUsers()
    .then((usersJSON) => {
      const users = JSON.parse(usersJSON);
      const result = Object.keys(users)
        .filter((username) => username.includes(queryString))
        .map((username) => ({ username: username, avatar: [users.avatar] }));
      res.status(200).json(JSON.stringify(result));
    })
    .catch((err) => {
      const { code, message } = err;
      res.status(code || 500).json({ error: message });
    });
});

router.post("/", (req, res) => {
  const payload = req.body;
  userController.createUser(payload);
});

const userRoutes = router;
module.exports = { userRoutes };
