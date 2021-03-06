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
    ROOM_NOT_EXIST: "Chat-room with provided ID does not exist",
  },
};

const FILE_PATHS = {
  USER: "Database/Data/users.json",
  MESSAGE: "Database/Data/messages.json",
  CHATROOM: "Database/Data/chatrooms.json",
};

module.exports = { ERROR_MESSAGES, FILE_PATHS };
