require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const cors = require('cors')
const router = require('./routes/index')
const fileUpload = require('express-fileupload')
const path = require('path')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')

const PORT = process.env.PORT || 7000

const allowedOrigins = [
    'http://localhost:5173',
    'https://plask-jet.vercel.app',
    /^https:\/\/plask-.*\.vercel\.app$/
]

const app = express()
app.use(cors({
    origin: (origin, cb) => {
        if (!origin) return cb(null, true)
        const ok = allowedOrigins.some(o =>
            typeof o === 'string' ? o === origin : o.test(origin)
        )
        cb(ok ? null : new Error('CORS blocked'), ok)
    },
    credentials: true
}))

app.use(express.json())
app.use(fileUpload({}))
app.use('/static', express.static(path.resolve(__dirname, 'static')))
app.use('/api', router)

app.use(errorHandler)

let server

const start = async () => {
    try {
        await sequelize.authenticate()
        // await sequelize.sync()
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server started on port ${PORT}`)
        })
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

start()

module.exports = { app, start }