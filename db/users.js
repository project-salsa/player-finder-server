const User = require('./init').User

/*
  getUser - finds a user in the database with given parameter
  param username - String - the unique name of the user to be pulled from the db
  returns - Promise - returns user entry upon resolve, rejects with error otherwise
 */
function getUser (username) {
  return new Promise((resolve, reject) => {
    if (username === null || typeof username === 'undefined') {
      return reject(new Error('ERROR: please supply a valid username parameter'))
    }
    User.find({ username: username }, (err, entry) => {
      if (err) {
        return reject(err)
      } else if (typeof entry === 'undefined') {
        return reject(new Error('ERROR: Attempted to pass an undefined object into getUser() function'))
      } else if (entry.length > 1) {
        // TODO log db error
        return reject(new Error('ERROR: Multiple usernames detected. Please check database integrity'))
      }
      console.log(entry[0])
      return resolve(entry[0])
    })
  })
}

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
        return reject(new Error(err))
      }
      return resolve(data)
    })
  })
}

module.exports = {
  getUser: getUser,
  createUser: createUser
}