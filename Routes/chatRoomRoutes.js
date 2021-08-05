const express = require("express"),
  router = express.Router();

const { ChatRoomController } = require("../Controllers/ChatRoomController"),
  chatRoomController = new ChatRoomController();

router.get("/:roomId", (req, res) => {
  const roomId = req.params.roomId;
  chatRoomController
    .getChatRoom(roomId)
    .then((data) => res.status(200).json(data))
    .catch((err) => {
      const { code, message } = err;
      res.send(code).json({ error: message });
    });
});

router.post("/:roomId", (req, res) => {
  const roomId = req.params.roomId;
  const payload = req.body;
  chatRoomController
    .addNewMessage(roomId, payload)
    .then((data) => res.status(200).json(data))
    .catch((err) => {
      const { code, message } = err;
      res.status(code).json({ error: message });
    });
});

router.post("/", (req, res) => {
  const payload = req.body;
  console.log(payload);
  chatRoomController
    .createChatRoom(payload)
    .then((data) => res.status(200).json(data))
    .catch((err) => {
      const { code, message } = err;
      res.status(code).json({ error: message });
    });
});

const chatRoomRoutes = router;
module.exports = { chatRoomRoutes };
