require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const cors = require('cors')
const router = require('./routes/index')
const fileUpload = require('express-fileupload')
const path = require('path')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')

const PORT = process.env.PORT || 7000

const app = express()
app.use(cors())
app.use(express.json())
app.use(fileUpload({}))
app.use('/static', express.static(path.resolve(__dirname, 'static')))
app.use('/api', router)

app.use(errorHandler)

let server

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        server = await new Promise((resolve, reject) => {
            const srv = app.listen(PORT, () => {
                console.log(`Server started on port ${PORT}`)
                resolve(srv)
            })
            srv.on("error", reject)
        })
    } catch (error) {
        console.log(error)
    }
}

const stop = async () => {
    try {
        await sequelize.close()
        if (server) {
            await new Promise((reject, resolve) => server.close(error ? reject() : resolve()))
            console.log("Server stopped")
        }
    } catch (error) {
        console.log(error)
    }
}

start()

module.exports = { app, start, stop }