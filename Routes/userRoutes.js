const { responseSender } = require("../utils");
const express = require("express"),
  router = express.Router();

const { UserController } = require("../Controllers/UserController"),
  userController = new UserController();

router.get("/", (req, res) => {
  responseSender(userController.getUsers(), res);
});

router.get("/:username", (req, res) => {
  const username = req.params.username;
  responseSender(userController.getUsers(username), res);
});

router.get("/getRooms/:username", (req, res) => {
  const username = req.params.username;
  responseSender(userController.getUserRooms(username), res);
});

router.get("/query/:queryString", (req, res) => {
  const queryString = req.params.queryString;
  userController
    .getUsers()
    .then((usersJSON) => {
      const users = JSON.parse(usersJSON);
      const result = users.filter((user) =>
        user.username.includes(queryString)
      );
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
