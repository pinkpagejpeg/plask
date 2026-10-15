require('dotenv').config()

const commonDev = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  dialect: 'postgres',
  logging: false
}

const commonProd = {
  use_env_variable: 'DATABASE_URL',
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false }
  }
}

module.exports = {
  development: commonDev,
  test: commonDev,
  production: commonProd
}