const { mockUserJwtToken } = require('@mocks/jwtTokenMocks')

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

const checkRouteWithoutAdminRights = async (
    method,
    route,
    responseArgs
) => {
    let request = method(route).set('Authorization', `Bearer ${mockUserJwtToken}`)

    if (responseArgs) {
        request.send(responseArgs)
    }

    const response = await request

    expect(response.status).toBe(403)
    expect(response.body.message).toBe('Пользователь не обладает правами администратора')
}

const checkRouteWithNonexistentData = async (
    method,
    route,
    message,
    token,
    responseArgs
) => {
    let request = method(route)

    if (token) {
        request.set('Authorization', `Bearer ${token}`)
    }

    if (responseArgs) {
        request.send(responseArgs)
    }

    const response = await request

    expect(response.status).toBe(404)
    expect(response.body.message).toBe(message)
}

module.exports = {
    checkRouteWithInvalidInfo,
    checkRouteWithInvalidToken,
    checkRouteWithNonexistentData,
    checkRouteWithoutAdminRights
}