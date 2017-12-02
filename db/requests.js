const Game = require('./init').Game
const Request = require('./init').Request
const getUser = require('./users').getUser
const getGame = require('./games').getGame

/**
 * createRequest - create a new request(game room) in DB based on parameters
 * @param title - String - the title of the room
 * @param user - ObjectId - the user who created the room
 * @param game - ObjectId - the game the room plays
 * @param platform - String - the platform the room uses
 * @param tags - [String] - tags of the game or anything
 * @param location - String - the location of the user
 * @param maxPlayers - Number - maximum player in the room
 * @returns {Promise} - resolves with data if successful, rejects with err if not
 */
function createRequest (
  title,
  user,
  game,
  platform,
  tags,
  location,
  maxPlayers) {
  return new Promise((resolve, reject) => {
    if (createRequest.length !== arguments.length) {
      return reject(new Error('All args must be defined'))
    }
    Request.create({
      title: title,
      user: user,
      game: game,
      platform: platform,
      tags: tags,
      location: location,
      maxPlayers: maxPlayers,
      currentPlayers: [],
      isActive: true
    },
    (err, data) => {
      if (err) {
        return reject(err)
      }
      return resolve(data)
    })
  })
}

/**
 * createRequestFromRaw - takes raw data to pull ObjectId info and passes to createRequest
 * @param title - String - title of the post
 * @param user - String - name of the host
 * @param game - String - name of the game
 * @param platform - String - name of platform
 * @param tags - [String] - tags for search and filter
 * @param location - String - name of location
 * @param maxPlayers - Number - max number of players to play
 * @returns {Promise} - resolves with data if success, rejects with err otherwise
 */
function createRequestFromRaw (
  title,
  user,
  game,
  platform,
  tags,
  location,
  maxPlayers) {
  return new Promise((resolve, reject) => {
    let userId
    let gameId
    getUser(user).then((userObject) => {
      userId = userObject._id
      getGame(game).then((gameObject) => {
        gameId = gameObject._id
        createRequest(
          title,
          userId,
          gameId,
          platform,
          tags,
          location,
          maxPlayers
        ).then((data) => {
          return resolve(data)
        }).catch((err) => {
          console.log('Other error')
          return reject(err)
        })
      }).catch((err) => {
        console.log('Game error')
        return reject(err)
      })
    }).catch((err) => {
      console.log('Name error')
      return reject(err)
    })
  })
}

function getRequest (requestId) {
  return new Promise((resolve, reject) => {
    if (getPopulatedRequest.length !== arguments.length) {
      return reject(new Error('all parameters must be defined'))
    }
    const query = Request.find({ _id: requestId })
    query.then((request) => {
      if (request.length > 1) {
        console.log('Warning there is a problem with the requests collection')
      }
      return resolve(request[0])
    }).catch((err) => {
      reject(err)
    })
  })
}

function getPopulatedRequest (requestId) {
  return new Promise((resolve, reject) => {
    if (getPopulatedRequest.length !== arguments.length) {
      return reject(new Error('all parameters must be defined'))
    }
    const query = Request
      .findOne({ _id: requestId })
      .populate('game')
      .populate('user')
      .exec()
    query.then((request) => {
      if (request !== null && typeof request !== 'undefined') {
        request.user.password = null
        request.user.salt = null
        request.user.iterations = null
      }
      return resolve(request)
    }).catch((err) => {
      reject(err)
    })
  })
}

function getRequests () {
  return new Promise((resolve, reject) => {
    const query = Request.find().populate('game').populate('user').exec()
    query.then((requests) => {
      for (const request of requests) {
        request.user.password = null
      }
      return resolve(requests)
    }).catch((err) => {
      return reject(err)
    })
  })
}

/**
 * Gets a list of requests based on a game name
 * @param gameName - String - The game name to query by
 * @return {Promise}
 *    resolve - [Object] - array of objects returned, [] if none found
 *        null is returned if game does not exist
 */
function getRequestByGame (gameName) {
  return new Promise((resolve, reject) => {
    Game.find({'name': gameName}, (err, game) => {
      if (err !== null && typeof err !== 'undefined') {
        return reject(new Error(err))
      }
      if (game.length > 1) {
        // TODO Error needs to be logged
        // There is a problem with the integrity of the database
      }
      if (game.length === 0) {
        // If there is no game with that name then the request is invalid
        // so we will resolve with null
        return resolve(null)
      }
      Request.find({'game': game[0]._id}, (err, requests) => {
        if (err !== null && typeof err !== 'undefined') {
          return reject(new Error(err))
        }
        return resolve(requests)
      })
    })
  })
}

/**
 * Function to edit a request in the database
 * @param requestId mongo Object ID of the request to be modified
 * @param dataToUpdate Object of data to update. Each field is optional but must
 *  have at least one filled out
 *    {
 *      title: String,
 *      user: ObjectId,
 *      game: ObjectId,
 *      platform: String,
 *      tags: [String],
 *      location: String,
 *      maxPlayers: Number,
 *      currentPlayers: [ObjectId],
 *      isActive: Boolean
 * @return {Promise} Resolves on success and rejects if invalid data is provided
 *  as well as when there are any errors
 */
function editRequest (requestId, dataToUpdate) {
  const userData = {}
  const validFields = [
    'title',
    'game',
    'platform',
    'tags',
    'location',
    'maxPlayers',
    'currentPlayers',
    'isActive'
  ]
  return new Promise((resolve, reject) => {
    if (arguments.length !== editRequest.length) {
      return reject(new Error('All arguments required'))
    }
    // Strip off any fields that are not in the validFields array
    for (const dataName in dataToUpdate) {
      // TODO enforce types on edited fields
      if (dataToUpdate.hasOwnProperty(dataName) && validFields.includes(dataName)) {
        userData[dataName] = dataToUpdate[dataName]
      }
    }
    getRequest(requestId).then((request) => {
      if (typeof request === 'undefined') {
        reject(new Error('Request not found'))
      }
      for (const changedField in userData) {
        if (userData.hasOwnProperty(changedField)) {
          request[changedField] = userData[changedField]
        }
      }
      request.save()
      return resolve()
    }).catch((err) => {
      reject(err)
    })
  })
}

/**
 * Adds user to currentPlayers for specified request
 * @param username username of user to be added
 * @param requestId mongo ID of request to be joined
 * @return {Promise} resolves if user was added or was already on the request
 *  rejects when something is wrong
 */
function joinRequest (username, requestId) {
  return new Promise((resolve, reject) => {
    getUser(username).then((user) => {
      if (typeof user === 'undefined') {
        return reject(new Error('User not found'))
      }
      getRequest(requestId).then((request) => {
        if (typeof request === 'undefined') {
          return reject(new Error('Request not found'))
        }
        const currentPlayers = request.currentPlayers.map(id => id.toString())
        const maxPlayers = request.maxPlayers
        const userId = user._id.toString()
        if (currentPlayers.length === maxPlayers) {
          return reject(new Error('max players reached'))
        }
        if (currentPlayers.includes(userId)) {
          // User has already joined
          return resolve()
        }
        request.currentPlayers.push(user._id)
        request.save()
        return resolve()
      })
    })
  })
}

/**
 * Removes user from currentPlayers for specified request
 * @param username username of user to be added
 * @param requestId mongo ID of request to be joined
 * @return {Promise} resolves if user was added or was already on the request
 *  rejects when something is wrong
 */
function leaveRequest (username, requestId) {
  return new Promise((resolve, reject) => {
    getUser(username).then((user) => {
      if (typeof user === 'undefined') {
        return reject(new Error('User not found'))
      }
      getRequest(requestId).then((request) => {
        if (typeof request === 'undefined') {
          return reject(new Error('Request not found'))
        }
        const currentPlayers = request.currentPlayers.map(id => id.toString())
        const userId = user._id.toString()
        if (!currentPlayers.includes(userId)) {
          // User is already not in the request
          return resolve()
        }
        request.currentPlayers = currentPlayers.filter(e => e !== userId)
        request.save()
        return resolve()
      })
    })
  })
}

/**
 * This gets a list of requests filtered based on a set of parameters passed
 * @param filterFields
 *      {
 *        user: String,
 *        game: String,
 *        joinedUser: String,
 *        tags: [String]
 *      }
 * @return {Promise}
 */
function getFilteredRequests (filterFields) {
  const fields = ['user', 'game', 'joinedUser', 'tags']
  const validFilters = {}
  return new Promise((resolve, reject) => {
    if (arguments.length !== getFilteredRequests.length) {
      return reject(new Error('All arguments required'))
    }
    // Make sure there are no extra fields passed in
    for (const field in filterFields) {
      if (filterFields.hasOwnProperty(field) && fields.includes(field)) {
        switch (field) {
          case 'tags':
            validFilters['tags'] = {'$in': filterFields['tags']}
            break
          default:
            validFilters[field] = filterFields[field]
        }
      } else {
        return reject(new Error('Only pass accepted fields: ' + fields))
      }
    }
    getFilteredRequestsFiller(validFilters).then((queryParams) => {
      const query = Request
        .find(queryParams)
        .populate('game')
        .populate('user')
        .exec()
      query.then((requests) => {
        for (const request of requests) {
          if (request.user !== null) {
            request.user.password = null
            request.user.salt = null
            request.user.iterations = null
          }
        }
        return resolve(requests)
      }).catch((err) => {
        return reject(err)
      })
    }).catch((err) => {
      return reject(err)
    })
  })
}

/**
 * Helper function for getFilteredRequests to grab User ID and Game ID
 * @param query
 * @return {Promise}
 */
function getFilteredRequestsFiller (query) {
  return new Promise((resolve, reject) => {
    getFilteredRequestsFillerUser(query.user).then((userId) => {
      if (userId !== null && typeof userId !== 'undefined') {
        query.user = userId
      }
      getFilteredRequestsFillerUser(query.joinedUser).then((joinedUserId) => {
        if (joinedUserId !== null && typeof joinedUserId !== 'undefined') {
          query.currentPlayers = joinedUserId
        }
        getFilteredRequestsFillerGame(query.game).then((gameId) => {
          if (gameId !== null && typeof gameId !== 'undefined') {
            query.game = gameId
          }
          return resolve(query)
        }).catch((err) => { reject(err) })
      }).catch((err) => { reject(err) })
    }).catch((err) => { reject(err) })
  })
}

function getFilteredRequestsFillerUser (username) {
  return new Promise((resolve, reject) => {
    if (typeof username === 'undefined') {
      return resolve()
    }
    getUser(username).then((user) => {
      if (typeof user === 'undefined') {
        return resolve(null)
      }
      return resolve(user._id)
    }).catch((err) => { reject(err) })
  })
}

function getFilteredRequestsFillerGame (gameName) {
  return new Promise((resolve, reject) => {
    if (typeof gameName === 'undefined') {
      return resolve(null)
    }
    getGame(gameName).then((game) => {
      if (typeof game === 'undefined') {
        return resolve(null)
      }
      return resolve(game._id)
    }).catch((err) => { reject(err) })
  })
}

module.exports = {
  createRequestFromRaw,
  getPopulatedRequest,
  getRequests,
  getRequestByGame,
  editRequest,
  joinRequest,
  leaveRequest,
  getFilteredRequests
}
