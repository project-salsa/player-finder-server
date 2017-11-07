const User = require('./init').User

/*
  getUser - finds a user in the database with given parameter
  param username - String - the unique name of the user to be pulled from the db
  returns - Promise - returns user entry upon resolve, rejects with error otherwise
 */
function getUser (username) {
  return new Promise((resolve, reject) => {
    if (username === null || typeof username === 'undefined') {
      return reject(new Error('Please supply a valid username parameter'))
    }
    User.find({ username: username }, (err, entry) => {
      if (err) {
        return reject(err)
      } else if (typeof entry === 'undefined') {
        return reject(new Error('Attempted to pass an undefined object into getUser() function'))
      }
      if (entry.length > 1) {
        console.log('Warning: Multiple instances of the user "' + username + '" exist in the database')
      }
      return resolve(entry[0])
    })
  })
}

function createUser (username, password, salt, iterations, email) {
  return new Promise((resolve, reject) => {
    if (createUser.length !== arguments.length) {
      return reject(new Error('All args must be defined'))
    }
    const newUser = new User(
      {
        username: username,
        password: password,
        salt: salt,
        iterations: iterations,
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

/**
 * getUsers - gets all user objects in the database
 * @returns {Promise} - resolves with array user objects if successful, rejects with err if not
 */
function getUsers () {
  return new Promise((resolve, reject) => {
    User.find((err, users) => {
      if (err !== null && typeof err !== 'undefined') {
        return reject(err)
      }
      console.log(users)
      return resolve(users)
    })
  })
}

module.exports = {
  getUsers,
  getUser,
  createUser
}
