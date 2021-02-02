const bcrypt = require('bcrypt')
const chalk = require('chalk')
const MongoLib = require('../../lib/mongo')
const { config } = require('../../config')

const buildAdminUser = (password) => {
  return {
    password,
    username: config.authAdminUsername,
    email: config.authAdminEmail
  }
}

const hasAdminUser = async (mongoDB) => {
  const adminUser = await mongoDB.getAll('users', {
    username: config.authAdminUsername
  })

  return adminUser && adminUser.length
}

const createAdminUser = async (mongoDB) => {
  const hashedPassword = await bcrypt.hash(config.authAdminPassword, 10)
  const userId = await mongoDB.create('users', buildAdminUser(hashedPassword))

  return userId
}

const seedAdmin = async () => {
  try {
    const mongoDB = new MongoLib()
    const hasAdmin = await hasAdminUser(mongoDB)

    if (hasAdmin) {
      console.log(chalk.yellow('Admin user already exists'))
      return process.exit(1)
    }

    const adminUserId = await createAdminUser(mongoDB)
    console.log(chalk.green('Admin user created with id:', adminUserId))
    return process.exit(0)
  } catch (err) {
    console.log(chalk.red(err))
    process.exit(1)
  }
}

seedAdmin()
