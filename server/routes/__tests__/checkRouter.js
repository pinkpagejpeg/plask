const jwt = require('jsonwebtoken')

let mockUserJwtToken = jwt.sign({
    id: 1,
    email: 'user@example.com',
    role: 'USER'
}, process.env.SECRET_KEY)

let mockAdminJwtToken = jwt.sign({
    id: 2,
    email: 'admin@example.com',
    role: 'ADMIN'
}, process.env.SECRET_KEY)

const checkRouteWithInvalidInfo = async (
    method,
    route,
    expectedResponseMessage,
    responseArgs,
    token
) => {
    let request = method(route)

    if (token) {
        request.set('Authorization', `Bearer ${token}`)
    }

    if (responseArgs) {
        request.send(responseArgs)
    }

    const response = await request

    expect(response.status).toBe(400)
    expect(response.body.message).toContain(expectedResponseMessage)
}

const checkRouteWithInvalidToken = async (
    method,
    route,
    token,
    responseArgs
) => {
    let request = method(route).set('Authorization', token)

    if (responseArgs) {
        request.send(responseArgs)
    }

    const response = await request

    expect(response.status).toBe(401)
    expect(response.body.message).toBe('Пользователь не авторизован')
}

module.exports = {
    mockUserJwtToken,
    mockAdminJwtToken,
    checkRouteWithInvalidInfo,
    checkRouteWithInvalidToken
}