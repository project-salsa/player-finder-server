'use strict'

const User = require('./init').User

function createUser (username, password, email) {
  return new Promise((resolve, reject) => {
    if (createUser.length !== arguments.length) {
      return reject(new Error('All args must be defined'))
    }
    const newUser = new User(
      {
        username: username,
        password: password,
        email: email,
        subscribedTags: [],
        notificationTags: [],
        discordId: '',
        steamId: '',
        battleNetId: ''
      })

    newUser.save((err, data) => {
      if (err) {
        return reject(err)
      }

      return resolve(data)
    })
  })
}

module.exports = {
  createUser
}
