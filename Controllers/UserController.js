const { DB } = require("../Database/DB");
const { FILE_PATHS, ERROR_MESSAGES } = require("../constants");
const { checkUserInput } = require("../utils");

class UserController extends DB {
  constructor() {
    super(FILE_PATHS.USER);
  }

  authenticateUser(username, password) {
    return new Promise(async (resolve, reject) => {
      try {
        const userDataJSON = await this.readFromDB();
        const userData = JSON.parse(userDataJSON);
        if (!userData[username]) {
          reject({
            code: 401,
            message: ERROR_MESSAGES[401].USER,
          });
        } else if (userData[username].password !== password) {
          reject({
            code: 401,
            message: ERROR_MESSAGES[401].INVALID_CRED,
          });
        } else {
          resolve(JSON.stringify(userData[username]));
        }
      } catch (err) {
        reject({ code: 401, ...err });
      }
    });
  }

  removeSensitiveInfo(userData) {
    return Object.values(userData).reduce((acc, user) => {
      return [...acc, { username: user.username, avatar: user.avatar }];
    }, []);
  }

  getUsers(username = "") {
    return new Promise(async (resolve, reject) => {
      try {
        const userDataJSON = await this.readFromDB();
        const userData = JSON.parse(userDataJSON);
        const allUsersData = this.removeSensitiveInfo(userData);
        if (username === "") {
          resolve(JSON.stringify(allUsersData));
        } else if (userData[username]) {
          resolve(JSON.stringify(userData[username]));
        } else {
          reject({ code: 401, message: ERROR_MESSAGES[401].USER });
        }
      } catch (err) {
        reject({ ...err });
      }
    });
  }

  getUserRooms(username) {
    return new Promise(async (resolve, reject) => {
      try {
        const userDataJSON = await this.readFromDB();
        const userData = JSON.parse(userDataJSON);

        if (!userData[username]) {
          reject({
            code: 400,
            message: ERROR_MESSAGES[400].USER_NOT_EXISTS,
          });
        } else {
          resolve(
            JSON.stringify({
              personalChatsSubscribed:
                userData[username].personalChatsSubscribed,
              groupChatsSubscribed: userData[username].groupChatsSubscribed,
            })
          );
        }
      } catch (err) {
        reject({ ...err });
      }
    });
  }

  createUser() {
    return new Promise(async (resolve, reject) => {
      try {
        if (!checkUserInput(payload, ["username", "password", "avatar"])) {
          reject({
            code: 400,
            message: ERROR_MESSAGES[400].GENERAL,
          });
        }

        const existingUsersJSON = this.readFromDB();
        const existingUsers = JSON.parse(existingUsersJSON);

        if (existingUsers[payload.username]) {
          reject({
            code: 400,
            message: ERROR_MESSAGES[400].USER_EXISTS,
          });
        }

        const newUsers = {
          ...existingUsers,
          [payload.username]: {
            username: payload.username,
            password: payload.password,
            avatar: payload.avatar,
            personalChatsSubscribed: [],
            groupChatsSubscribed: [],
          },
        };

        const newUsersJSON = JSON.stringify(newUsers);
        await this.writeToDB(newUsersJSON);

        resolve(payload);
      } catch (err) {
        reject({
          ...err,
        });
      }
    });
  }
}

module.exports = { UserController };
