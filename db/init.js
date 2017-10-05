const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/tangled')

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

let requestSchema = new Schema({
  title: String,
  user: ObjectId,
  game: ObjectId,
  platform: String,
  tags: [String],
  location: String,
  maxPlayers: Number,
  currentPlayers: [ObjectId]
})
let userSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  password: String,
  email: {
    type: String,
    unique: true
  },
  subscribedTags: [String],
  notificationTags: [String],
  discordId: String,
  steamId: String,
  battleNetId: String
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

module.exports = {
  User: User,
  Request: Request,
  Game: Game
}
