const { DB } = require("../Database/DB");
const { FILE_PATHS, ERROR_MESSAGES } = require("../constants");
const { checkUserInput } = require("../utils");
const { UserController } = require("./UserController");

class ChatRoomController extends DB {
  constructor() {
    super(FILE_PATHS.CHATROOM);
  }

  getChatRoom(roomId) {
    return new Promise(async (resolve, reject) => {
      try {
        const chatRoomDataJSON = await this.readFromDB();
        const chatRoomData = JSON.parse(chatRoomDataJSON);
        resolve(JSON.stringify(chatRoomData[roomId]));
      } catch (err) {
        reject({ ...err });
      }
    });
  }

  addNewMessage(roomId, payload) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!checkUserInput(payload, ["text", "sentBy", "timestamp"])) {
          reject({
            code: 400,
            message: ERROR_MESSAGES[400].GENERAL,
          });
        }

        const existingChatRoomsJSON = await this.readFromDB();
        const existingChatRooms = JSON.parse(existingChatRoomsJSON);

        if (!existingChatRooms[roomId]) {
          reject({
            code: 400,
            message: ERROR_MESSAGES[400].ROOM_NOT_EXIST,
          });
        }

        const currentRoomMessageHistory =
          existingChatRooms[roomId].messageHistory;
        const newRoomMessageHistory = [
          ...currentRoomMessageHistory,
          {
            text: payload.text,
            sentBy: payload.sentBy,
            timestamp: payload.timestamp,
            messageId: currentRoomMessageHistory.length,
          },
        ];
        existingChatRooms[roomId].messageHistory = newRoomMessageHistory;

        const newChatRoomsJSON = JSON.stringify(existingChatRooms);
        await this.writeToDB(newChatRoomsJSON);

        resolve(JSON.stringify(payload));
      } catch (err) {
        reject({
          ...err,
        });
      }
    });
  }

  createChatRoom(payload) {
    return new Promise(async (resolve, reject) => {
      try {
        if (
          !checkUserInput(payload, [
            "roomId",
            "roomName",
            "type",
            "participants",
          ])
        ) {
          reject({
            code: 400,
            message: ERROR_MESSAGES[400].GENERAL,
          });
        }
        const userController = new UserController();

        const usersJSON = await userController.readFromDB();
        const users = JSON.parse(usersJSON);
        const existingChatRoomsJSON = await this.readFromDB();
        const existingChatRooms = JSON.parse(existingChatRoomsJSON);

        if (existingChatRooms[payload.roomId]) {
          reject({
            code: 400,
            message: ERROR_MESSAGES[400].ROOM_EXISTS,
          });
        }

        const participants = [...new Set(payload.participants)];

        if (participants.length === 1 && payload.type === "group") {
          reject({
            code: 400,
            message: ERROR_MESSAGES[400].NOT_ENOUGH_PARTICIPANTS,
          });
        }

        participants
          .filter((user) => users[user])
          .forEach((user) => {
            if (payload.type === "personal") {
              users[user].personalChatsSubscribed = [
                ...users[user].personalChatsSubscribed,
                { roomId: payload.roomId, roomName: payload.roomName },
              ];
            } else {
              users[user].groupChatsSubscribed = [
                ...users[user].groupChatsSubscribed,
                { roomId: payload.roomId, roomName: payload.roomName },
              ];
            }
          });

        const newChatRooms = {
          ...existingChatRooms,
          [payload.roomId]: {
            ...payload,
            messageHistory: [],
          },
        };

        const newChatRoomsJSON = JSON.stringify(newChatRooms);
        const newUsersJSON = JSON.stringify(users);
        await this.writeToDB(newChatRoomsJSON);
        await userController.writeToDB(newUsersJSON);

        resolve(JSON.stringify({ payload, messageHistory: [] }));
      } catch (err) {
        reject({
          ...err,
        });
      }
    });
  }
}

module.exports = { ChatRoomController };
