'use strict'

const getUser = require('../db/users').getUser
const compare = require('./auth').compare

/**
 * Uses a username and a password to check if a user is signed in
 * @param username - String -  The name of the user who we are trying to log in
 * @param password - String - The password of the user who is trying to log in
 * @return {Promise}
 *  resolve - (Boolean || User Info Object) -
 *      User Object if user successfully logs in
 *        {
 *          id: ObjectID,
 *          role: String
 *        }
 *      false if it worked, but password is wrong
 *      null if the user doesn't exist
 *  reject - (err) - Rejects if there is an error
 */
function login (username, password) {
  return new Promise((resolve, reject) => {
    getUser(username).then((user) => {
      if (typeof user === 'undefined') {
        // If the team is undefined then there must not have been a match
        return resolve(null)
      } else {
        const encryptedPassword = user.password
        const salt = user.salt
        const iterations = user.iterations
        // Checking to see if given password matches the one in the db
        if (compare(encryptedPassword, password, salt, iterations)) {
          const userInfo = {
            id: user._id,
            role: user.role
          }
          return resolve(userInfo)
        }
        // If compare failed then they must have given the wrong password
        return resolve(false)
      }
    }, (err) => {
      reject(err)
    }).catch((err) => {
      reject(err)
    })
  })
}

module.exports = {
  login
}
