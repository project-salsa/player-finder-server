'use strict'

const User = require('./init').User

function createUser (username, password, email) {
  return new Promise((resolve, reject) => {
    if (typeof username === 'undefined') {
      return reject(new Error('Error: Username field is undefined'))
    }
    if (typeof password === 'undefined') {
      return reject(new Error('Error: Password field is undefined'))
    }
    if (typeof email === 'undefined') {
      return reject(new Error('Error: Email field is undefined'))
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
        return reject(new Error(err))
      }

      return resolve(data)
    })
  })
}

module.exports = {
  createUser: createUser
}
