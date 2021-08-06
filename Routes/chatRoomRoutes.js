const { responseSender } = require("../utils");
const express = require("express"),
  router = express.Router();

const { ChatRoomController } = require("../Controllers/ChatRoomController"),
  chatRoomController = new ChatRoomController();

router.get("/:roomId", (req, res) => {
  const roomId = req.params.roomId;
  responseSender(chatRoomController.getChatRoom(roomId), res);
});

router.post("/:roomId", (req, res) => {
  const roomId = req.params.roomId;
  const payload = req.body;
  responseSender(chatRoomController.addNewMessage(roomId, payload), res);
});

router.post("/", (req, res) => {
  const payload = req.body;
  responseSender(chatRoomController.createChatRoom(payload), res);
});

const chatRoomRoutes = router;
module.exports = { chatRoomRoutes };
