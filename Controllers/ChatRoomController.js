const { DB } = require("../Database/DB");
const { FILE_PATHS, ERROR_MESSAGES, PAGE_SIZE } = require("../constants");
const { checkUserInput, binarySearch } = require("../utils");
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

        if (!chatRoomData[roomId]) {
          reject({
            code: 400,
            message: ERROR_MESSAGES[400].ROOM_NOT_EXIST,
          });
        }
        const curRoomMessageHistory = chatRoomData[roomId].messageHistory;
        const sendRoomMessageHistory =
          curRoomMessageHistory.length < PAGE_SIZE
            ? curRoomMessageHistory
            : curRoomMessageHistory.slice(
                curRoomMessageHistory.length - PAGE_SIZE
              );

        const sendChatRoomData = {
          ...chatRoomData[roomId],
          messageHistory: sendRoomMessageHistory,
        };
        resolve(JSON.stringify(sendChatRoomData));
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

        const trueParticipants = participants.filter((user) => users[user]);

        if (trueParticipants.length <= 1) {
          reject({
            code: 400,
            message: ERROR_MESSAGES[400].NOT_ENOUGH_PARTICIPANTS,
          });
        }

        trueParticipants.forEach((user) => {
          if (payload.type === "personal") {
            users[user].personalChatsSubscribed = [
              ...users[user].personalChatsSubscribed,
              {
                roomId: payload.roomId,
                roomName:
                  user === payload.creator ? payload.added : payload.creator,
              },
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

  addParticipant({ roomId, participant }) {
    return new Promise(async (resolve, reject) => {
      try {
        const chatRoomDataJSON = await this.readFromDB();
        const chatRoomData = JSON.parse(chatRoomDataJSON);

        if (!chatRoomData[roomId]) {
          reject({
            code: 400,
            message: ERROR_MESSAGES[400].ROOM_NOT_EXIST,
          });
        }

        const userController = new UserController();

        const usersJSON = await userController.readFromDB();
        const users = JSON.parse(usersJSON);

        if (!users[participant]) {
          reject({
            code: 400,
            message: ERROR_MESSAGES[400].USER_NOT_EXISTS,
          });
        }

        if (chatRoomData[roomId].participants.includes(participant)) {
          resolve(JSON.stringify(payload));
        }

        users[participant].groupChatsSubscribed = [
          ...users[participant].groupChatsSubscribed,
          { roomId, roomName: chatRoomData[roomId].roomName },
        ];

        const curChatRoom = chatRoomData[roomId];
        curChatRoom.participants = [...curChatRoom.participants, participant];

        chatRoomData[roomId] = curChatRoom;
        const newChatRoomJSON = JSON.stringify(chatRoomData);
        const newUsersJSON = JSON.stringify(users);
        await userController.writeToDB(newUsersJSON);
        await this.writeToDB(newChatRoomJSON);

        resolve(JSON.stringify(payload));
      } catch (err) {
        console.log(err);
        reject({
          ...err,
        });
      }
    });
  }

  getPrevMessages(roomId, cursor) {
    return new Promise(async (resolve, reject) => {
      try {
        const chatRoomDataJSON = await this.readFromDB();
        const chatRoomData = JSON.parse(chatRoomDataJSON);

        if (!chatRoomData[roomId]) {
          reject({
            code: 400,
            message: ERROR_MESSAGES[400].ROOM_NOT_EXIST,
          });
        }

        const curChatRoomMessages = chatRoomData[roomId].messageHistory;
        const endIndx = binarySearch(curChatRoomMessages, cursor);

        if (endIndx === undefined) {
          reject({
            code: 400,
            message: ERROR_MESSAGES[400].INVALID_CURSOR,
          });
        }

        const startIndx = endIndx - PAGE_SIZE < 0 ? 0 : endIndx - PAGE_SIZE;

        if (endIndx === startIndx) {
          reject({
            code: 400,
            message: ERROR_MESSAGES[400].NO_MORE_MESSAGES,
          });
        }

        resolve(JSON.stringify(curChatRoomMessages.slice(startIndx, endIndx)));
      } catch (err) {
        reject({ ...err });
      }
    });
  }

  getNewMessages(roomId, cursor) {
    return new Promise(async (resolve, reject) => {
      try {
        const chatRoomDataJSON = await this.readFromDB();
        const chatRoomData = JSON.parse(chatRoomDataJSON);

        if (!chatRoomData[roomId]) {
          reject({
            code: 400,
            message: ERROR_MESSAGES[400].ROOM_NOT_EXIST,
          });
        }

        const curChatRoomMessages = chatRoomData[roomId].messageHistory;
        const cursorIndx = binarySearch(curChatRoomMessages, cursor);

        if (cursorIndx === undefined) {
          reject({
            code: 400,
            message: ERROR_MESSAGES[400].INVALID_CURSOR,
          });
        }
        const startIndx = cursorIndx + 1;

        if (startIndx === curChatRoomMessages.length) {
          resolve(JSON.stringify([]));
        }

        resolve(JSON.stringify(curChatRoomMessages.slice(startIndx)));
      } catch (err) {
        reject({ ...err });
      }
    });
  }
}

module.exports = { ChatRoomController };
