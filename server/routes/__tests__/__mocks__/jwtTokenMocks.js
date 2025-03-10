const jwt = require('jsonwebtoken')

const mockUserJwtToken = jwt.sign({
    id: 1,
    email: 'user@example.com',
    role: 'USER'
}, process.env.SECRET_KEY)

const mockFakeUserJwtToken = jwt.sign({
    id: 0,
    email: 'user@example.com',
    role: 'USER'
}, process.env.SECRET_KEY)

const mockAdminJwtToken = jwt.sign({
    id: 2,
    email: 'admin@example.com',
    role: 'ADMIN'
}, process.env.SECRET_KEY)

module.exports = {
    mockUserJwtToken,
    mockAdminJwtToken,
    mockFakeUserJwtToken,
}