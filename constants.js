const CONTROLLERS = {
  USER: "USER",
  MESSAGE: "MESSAGE",
  CHATROOM: "CHATROOM",
};

const ERROR_MESSAGES = {
  500: "Internal Server Error",
  401: {
    USER: "User does not exist",
    INVALID_CRED: "Username and password do not match",
  },
  400: {
    GENERAL: "Invalid request to server",
    USER_EXISTS: "User with the provided username already exists",
    ROOM_EXISTS: "Chat-room with provided ID already exists",
  },
};

const FILE_PATHS = {
  USER: "/Users/ballerbuoy/code/practice/server/Database/Data/users.json",
  MESSAGE: "/Users/ballerbuoy/code/practice/server/Database/Data/messages.json",
  CHATROOM:
    "/Users/ballerbuoy/code/practice/server/Database/Data/chatrooms.json",
};

module.exports = { ERROR_MESSAGES, FILE_PATHS };
