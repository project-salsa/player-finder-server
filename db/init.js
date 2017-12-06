const mongoose = require('mongoose')

const vars = require('../vars')

mongoose.Promise = Promise
mongoose.connect('mongodb://' + vars.DB_HOST + '/' + vars.DB_NAME)

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

let requestSchema = new Schema({
  title: String,
  user: { type: ObjectId, ref: 'User' },
  game: { type: ObjectId, ref: 'Game' },
  platform: String,
  tags: [String],
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [Number]
  },
  contactInfo: String,
  maxPlayers: Number,
  currentPlayers: [{ type: ObjectId, ref: 'User' }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {timestamps: {}})
requestSchema.index({location: '2dsphere'})
let userSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  password: String,
  salt: String,
  iterations: Number,
  email: {
    type: String,
    unique: true
  },
  completedFirstTimeSetUp: {
    type: Boolean,
    default: false
  },
  subscribedTags: [String],
  notificationTags: [String],
  discordId: String,
  steamId: String,
  battleNetId: String,
  profilePicUrl: String
})
let gameSchema = new Schema({
  name: {
    type: String,
    unique: true
  },
  iconUrl: String,
  bannerUrl: String,
  genres: [String],
  platforms: [String]
})

let User = mongoose.model('User', userSchema)
let Request = mongoose.model('Request', requestSchema)
let Game = mongoose.model('Game', gameSchema)

const errorCodes = {
  DUPLICATE_KEY: 11000
}

module.exports = {
  User,
  Request,
  Game,
  errorCodes
}
