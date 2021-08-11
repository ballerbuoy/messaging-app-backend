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

router.get("/getPrevMessages/:roomId/:cursor", (req, res) => {
  const { roomId, cursor } = req.params;
  console.log(roomId, cursor);
  responseSender(chatRoomController.getPrevMessages(roomId, cursor), res);
});

router.get("/getNewMessages/:roomId/:cursor", (req, res) => {
  const { roomId, cursor } = req.params;
  console.log(roomId, cursor);
  responseSender(chatRoomController.getNewMessages(roomId, cursor), res);
});

router.post("/", (req, res) => {
  const payload = req.body;
  responseSender(chatRoomController.createChatRoom(payload), res);
});

router.post("/addParticipant/:roomId", (req, res) => {
  const payload = req.body;
  console.log(payload);
  responseSender(chatRoomController.addParticipant(payload), res);
});

const chatRoomRoutes = router;
module.exports = { chatRoomRoutes };
