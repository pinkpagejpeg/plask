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

const checkRouteWithEmptyInfo = async (
    method,
    route,
    token,
    responseArgs,
    expectedResponseMessage
) => {
    const response = await method(route)
        .set('Authorization', `Bearer ${token}`)
        .send(responseArgs)

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
        request = request.send(responseArgs)
    }

    const response = await request

    expect(response.status).toBe(401)
    expect(response.body.message).toBe('Пользователь не авторизован')
}

module.exports = {
    mockUserJwtToken,
    mockAdminJwtToken,
    checkRouteWithEmptyInfo,
    checkRouteWithInvalidToken
}