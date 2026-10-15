const { Sequelize } = require('sequelize')
const config = require('./config/config')

const env = process.env.NODE_ENV || 'development'

let sequelize

if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
            ssl: { require: true, rejectUnauthorized: false }
        }
    })
} else {
    sequelize = new Sequelize(config[env])
}

module.exports = sequelize