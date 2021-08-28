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
    USER_NOT_EXISTS: "User with the provided username does not exist",
    ROOM_EXISTS: "Chat-room with provided ID already exists",
    ROOM_NOT_EXIST: "Chat-room with provided ID does not exist",
    NOT_ENOUGH_PARTICIPANTS: "Require atleast 2 participants to create a room",
    NO_MORE_MESSAGES: "No more messages in this chatroom",
    INVALID_CURSOR: "The cursor sent was invalid",
  },
};

const FILE_PATHS = {
  USER: "Database/Data/users.json",
  MESSAGE: "Database/Data/messages.json",
  CHATROOM: "Database/Data/chatRooms.json",
};

const GROUP_TYPE = {
  PERSONAL: "personal",
  GROUP: "group",
};

const PAGE_SIZE = 10;

module.exports = { ERROR_MESSAGES, FILE_PATHS, PAGE_SIZE, GROUP_TYPE };
