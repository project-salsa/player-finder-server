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

function getUserById (userId) {
  return new Promise((resolve, reject) => {
    if (getUserById.length !== arguments.length) {
      return reject(new Error('All args must be defined'))
    }
    User.findOne({ _id: userId }, (err, entry) => {
      if (err) {
        return reject(err)
      } else if (typeof entry === 'undefined') {
        return reject(new Error('Attempted to pass an undefined object into getUser() function'))
      }
      return resolve(entry)
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

/**
 * Function to edit a request in the database
 * @param userId mongo Object ID of the request to be modified
 * @param dataToUpdate Object of data to update. Each field is optional but must
 *  have at least one filled out
 *    {
 *      username: String,
 *      password: {
 *         epass: String,
 *         salt: String,
 *         iterations: Number
 *      }
 *      email: String,
 *      subscribedTags: [String],
 *      notificationTags: [String],
 *      discordId: String,
 *      steamId: String,
 *      battleNetId: String
 *    }
 * @return {Promise} Resolves on success and rejects if invalid data is provided
 *  as well as when there are any errors
 */
function editUser (userId, dataToUpdate) {
  const userData = {}
  const validFields = [
    'username',
    'password',
    'email',
    'subscribedTags',
    'notificationTags',
    'discordId',
    'steamId',
    'battleNetId'
  ]
  return new Promise((resolve, reject) => {
    if (arguments.length !== editUser.length) {
      return reject(new Error('All arguments required'))
    }
    // Strip off any fields that are not in the validFields array
    for (const dataName in dataToUpdate) {
      // TODO enforce types on edited fields
      if (dataToUpdate.hasOwnProperty(dataName) && validFields.includes(dataName)) {
        switch (dataName) {
          case 'password':
            const pass = dataToUpdate[dataName]
            if ('epass' in pass && 'salt' in pass && 'iterations' in pass) {
              userData.password = pass.epass
              userData.salt = pass.salt
              userData.iterations = pass.iterations
            } else {
              return reject(new Error('Password change needs epass, salt, and iterations'))
            }
            break
          default:
            userData[dataName] = dataToUpdate[dataName]
        }
      }
    }
    getUserById(userId).then((user) => {
      if (typeof user === 'undefined' || user === null) {
        reject(new Error('User not found'))
      }
      for (const changedField in userData) {
        if (userData.hasOwnProperty(changedField) && user.hasOwnProperty(changedField)) {
          user[changedField] = userData[changedField]
        }
      }
      user.save()
      return resolve()
    }).catch((err) => { reject(err) })
  })
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  editUser
}
