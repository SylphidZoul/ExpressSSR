const { config } = require('../config')
const debug = require('debug')('app:mongo')
const { MongoClient, ObjectId } = require('mongodb')

const USER = encodeURIComponent(config.dbUser)
const PASSWORD = encodeURIComponent(config.dbPassword)

const MONGO_URI = `mongodb+srv://${USER}:${PASSWORD}${config.dbHost}${config.dbName}?retryWrites=true&w=majority`

class MongoLib {
  constructor () {
    this.client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    this.dbName = process.env.DB_NAME
    this.connection = null
  }

  async connect () {
    if (this.connection === null) {
      try {
        await this.client.connect()
        debug('Connected successfully to mongo')
        this.connection = this.client.db(this.dbName)
      } catch (error) {
        throw new Error('Failed to connect to mongo')
      }
    }
    return this.connection
  }

  getAll (collection, query) {
    return this.connect().then(db => {
      return db.collection(collection).find(query).toArray()
    })
  }

  get (collection, id) {
    return this.connect().then(db => {
      return db.collection(collection).findOne({ _id: ObjectId(id) })
    })
  }

  create (collection, data) {
    return this.connect().then(db => {
      return db.collection(collection).insertOne(data)
    })
      .then(result => result.insertedId)
  }

  update (collection, id, data) {
    return this.connect().then(db => {
      return db.collection(collection).updateOne({ id_: ObjectId(id) }, { $set: data }, { upsert: true })
    })
      .then(result => result.upsertId || id)
  }

  delete (collection, id) {
    return this.connect().then(db => {
      return db.collection(collection).deleteOne({ _id: ObjectId(id) })
    })
      .then(() => id)
  }
}

module.exports = MongoLib
