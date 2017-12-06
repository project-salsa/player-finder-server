const express = require('express')
const router = express.Router()
const createRequest = require('../db/requests.js').createRequestFromRaw
const getPopulatedRequest = require('../db/requests').getPopulatedRequest
const getFilteredRequests = require('../db/requests').getFilteredRequests
const joinRequest = require('../db/requests').joinRequest
const leaveRequest = require('../db/requests').leaveRequest
const editRequest = require('../db/requests').editRequest
const getGame = require('../db/games').getGame

// All paths in this file should start with this
const path = '/requests'

/**
 * Returns all requests in the database
 * Possible parameters:
 *  user: String - Creator of request
 *  game: String - Name of game
 *  joined: Boolean - Whether the current signed in user has joined the request
 *  tags: [String] - Tags the request could have
 *  location: {
 *    coordinates: [Number, Number]
 *    distance: Number
 *  }
 * Response body:
    * success: Boolean - true if successful, false otherwise
    * message: String - contains error message if query fails
    * requests: [Object] - returns an array of request Objects if successful, null otherwise
 * Response Codes:
    * 200: Success
    * 500: Something went wrong
 */
router.get(path + '/', (req, res) => {
  const response = {
    success: false,
    message: '',
    requests: null
  }
  const userId = req.user.id
  const queryParams = req.query
  const requestsParams = {}
  // Check through query parameters
  for (const param in queryParams) {
    if (queryParams.hasOwnProperty(param)) {
      switch (param) {
        case 'user' || 'game':
          requestsParams[param] = queryParams[param]
          break
        case 'joined':
          if (queryParams[param] === 'true') {
            requestsParams['joinedUser'] = userId
          }
          break
        case 'tags':
          if (queryParams[param].constructor === Array) {
            requestsParams[param] = queryParams[param]
          } else {
            response.message = param + ' needs to be an array'
            return res.status(400).json(response)
          }
          break
        case 'location':
          const location = JSON.parse(queryParams[param])
          if ('coordinates' in location && 'distance' in location) {
            requestsParams[param] = {
              coordinates: location['coordinates'],
              distance: location['distance']
            }
          }
      }
    }
  }
  getFilteredRequests(requestsParams).then((requests) => {
    requests.sort((a, b) => {
      return b.createdAt - a.createdAt
    })
    response.requests = requests
    response.success = true
    return res.status(200).json(response)
  }).catch((err) => {
    response.message = err
    // TODO Log error instead of printing it
    console.log(err)
    return res.status(500).json(response)
  })
})

/**
 * Creates a new request object
 * Req body must contain:
    * title: String
    * user: String
    * game: String
    * platform: String
    * tags: [String]
    * location: [Number, Number]
    * contactInfo: String
    * maxPlayers: Number
 * Response Codes:
    * 201 - Success
    * 400 - Undefined field
    * 500 - Error
 */
router.post(path + '/', (req, res) => {
  const reqData = req.body
  const response = {
    success: false,
    message: '',
    requestId: ''
  }
  const requiredValues = ['title', 'user', 'game', 'platform', 'tags', 'location', 'contactInfo', 'maxPlayers']
  for (const value of requiredValues) {
    if (typeof reqData[value] === 'undefined' || reqData[value] === '') {
      response.message = 'Required field ' + value + ' is missing or undefined'
      return res.status(400).json(response)
    }
  }
  const tokenUsername = req.user.username
  const username = reqData.user
  if (tokenUsername !== username) {
    response.message = 'forbidden'
    return res.status(403).json(response)
  }
  createRequest(
    reqData.title,
    reqData.user,
    reqData.game,
    reqData.platform,
    reqData.tags,
    reqData.location,
    reqData.contactInfo,
    reqData.maxPlayers
  ).then((data) => {
    response.success = true
    response.requestId = data._id
    res.status(201).json(response)
  }).catch((err) => {
    response.message = err.message
    res.status(500).json(response)
  })
})

/**
 * Returns a specific request given a requestId
 * Response body:
    * success: Boolean - true if successful, false otherwise
    * message: String - returns error message if query fails
    * request: Object - returns a request Object if one is found, null otherwise
 * Response codes:
    * 200: Success
    * 404: Request not found
    * 500: Something went wrong
 */
router.get(path + '/:requestId', (req, res) => {
  const response = {
    success: false,
    message: '',
    request: null
  }
  getPopulatedRequest(req.params.requestId).then((request) => {
    if (request === null) {
      response.message = 'Specified request object ' + req.params.requestId + ' does not exist'
      return res.status(404).json(response)
    }
    response.success = true
    response.request = request
    return res.status(200).json(response)
  }).catch((err) => {
    console.log(err)
    response.message = err
    return res.status(500).json(response)
  })
})

/**
 * Edits a request
 *   title: String
 *   game: String
 *   platform: String
 *   tags: [String]
 *   location: [Number, Number]
 *   contactInfo: String
 *   maxPlayers: Number
 * Response body:
 *   success: Boolean - true if successful, false otherwise
 *   message: String - returns error message if query fails
 * Response codes:
 *   200: Success
 *   404: Request not found
 *   500: Something went wrong
 */
router.put(path + '/:requestId', (req, res) => {
  const response = {
    success: false,
    message: ''
  }
  const requestId = req.params.requestId
  const username = req.user.username
  const editableFields = [
    'title',
    'game',
    'platform',
    'tags',
    'location',
    'contactInfo',
    'maxPlayers'
  ]
  const body = req.body
  const editData = {}
  for (const key in body) {
    if (body.hasOwnProperty(key) && editableFields.includes(key)) {
      editData[key] = body[key]
    }
  }
  getPopulatedRequest(requestId).then((request) => {
    const requestUsername = request.user.username
    if (requestUsername !== username) {
      response.message = 'forbidden'
      return res.status(403).json(response)
    }
    if (editData.hasOwnProperty('game')) {
      // If they are changing the game then we need to get it's objectID
      getGame(editData.game).then((game) => {
        if (typeof game === 'undefined') {
          response.message = 'There is no game with that name'
          return res.status(400).json(response)
        }
        editData.game = game._id
        editRequest(requestId, editData).then(() => {
          response.success = true
          return res.status(200).json(response)
        }).catch((err) => {
          response.message = err.message
          return res.status(500).json(response)
        })
      })
    }
    editRequest(requestId, editData).then(() => {
      response.success = true
      return res.status(200).json(response)
    }).catch((err) => {
      response.message = err.message
      return res.status(500).json(response)
    })
  })
})

router.post(path + '/:requestId/join', (req, res) => {
  const response = {
    success: false,
    message: ''
  }
  const username = req.user.username
  const requestId = req.params.requestId
  joinRequest(username, requestId).then(() => {
    response.success = true
    return res.status(200).json(response)
  }).catch((err) => {
    if (err === 'Request not found') {
      response.message = 'not a valid requestId'
      return res.status(404).json(response)
    }
    console.log(err) // TODO Log error properly
    response.message = err
    return res.stat(500).json(response)
  })
})

router.post(path + '/:requestId/leave', (req, res) => {
  const response = {
    success: false,
    message: ''
  }
  const username = req.user.username
  const requestId = req.params.requestId
  leaveRequest(username, requestId).then(() => {
    response.success = true
    return res.status(200).json(response)
  }).catch((err) => {
    if (err === 'Request not found') {
      response.message = 'not a valid requestId'
      return res.status(404).json(response)
    }
    console.log(err) // TODO Log error properly
    response.message = err
    return res.stat(500).json(response)
  })
})

module.exports = {router}
