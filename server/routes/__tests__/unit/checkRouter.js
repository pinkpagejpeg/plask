const ApiError = require('../../../error/ApiError')
const formatErrorMessages = require('../../../error/formatErrorMessages')
const { validationResult } = require('express-validator')
const { mockUserJwtToken } = require('@mocks/jwtTokenMocks')

const checkRouteWithInvalidInfo = async (
    validatorMessage,
    handler,
    requestMethod,
    route,
    token,
    responseArgs,
) => {
    validationResult.mockImplementationOnce(() => ({
        isEmpty: jest.fn(() => false),
        array: jest.fn(() => validatorMessage.split(/, |\sи\s/).map(msg => ({ msg })))
    }))

    handler.mockImplementationOnce((req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return next(ApiError.badRequest(
                `Введены некорректные данные: ${formatErrorMessages(errors.array().map(error => error.msg))}`
            ))
        }
        res.status(200).json('Запрос успешно выполнен')
    })

    let request = requestMethod(route)

    if (token) {
        request.set('Authorization', `Bearer ${token}`)
    }

    if (responseArgs) {
        request.send(responseArgs)
    }

    const response = await request

    expect(response.status).toBe(400)
    expect(handler).toHaveBeenCalledTimes(1)
    expect(response.body.message).toBe(`Введены некорректные данные: ${validatorMessage}`)

}

const checkRouteWithInvalidToken = async (
    method,
    route,
    handler,
    token,
    responseArgs
) => {
    let request = method(route).set('Authorization', token)

    if (responseArgs) {
        request.send(responseArgs)
    }

    const response = await request

    expect(response.status).toBe(401)
    expect(response.body.message).toContain(!token ? 'Пользователь не авторизован' : 'Неверный или просроченный токен')
    expect(handler).not.toHaveBeenCalled()
}

const checkRouteWithoutAdminRights = async (
    method,
    route,
    handler,
    responseArgs
) => {
    let request = method(route).set('Authorization', `Bearer ${mockUserJwtToken}`)

    if (responseArgs) {
        request.send(responseArgs)
    }

    const response = await request

    expect(response.status).toBe(403)
    expect(response.body.message).toContain('Пользователь не обладает правами администратора')
    expect(handler).not.toHaveBeenCalled()
}

const checkRouteWithNonexistentData = async (
    method,
    route,
    handler,
    message,
    token,
    responseArgs
) => {
    handler.mockImplementationOnce((req, res, next) => {
        return next(ApiError.notFound(message))
    })

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
    expect(handler).toHaveBeenCalledTimes(1)
}

const checkRouteWithUnexpectedError = async (
    method,
    route,
    handler,
    token,
    responseArgs
) => {
    handler.mockImplementationOnce((req, res, next) => {
        return next(new Error('Unexpected error'))
    })

    let request = method(route)

    if (token) {
        request.set('Authorization', `Bearer ${token}`)
    }

    if (responseArgs) {
        request.send(responseArgs)
    }

    const response = await request

    expect(response.status).toBe(500)
    expect(response.body.message).toBe('Непредвиденная ошибка')
    expect(handler).toHaveBeenCalledTimes(1)
}

const checkRouteWithAnotherCandidate = async (
    errorMessage,
    handler,
    requestMethod,
    route,
    token,
    responseArgs,
) => {
    handler.mockImplementationOnce((req, res, next) => {
        return next(ApiError.badRequest(errorMessage))
    })

    let request = requestMethod(route)

    if (token) {
        request.set('Authorization', `Bearer ${token}`)
    }

    if (responseArgs) {
        request.send(responseArgs)
    }

    const response = await request

    expect(response.status).toBe(400)
    expect(handler).toHaveBeenCalledTimes(1)
    expect(response.body.message).toBe(errorMessage)
}

const checkRouteWithEmptyCaptcha = async (
    handler,
    requestMethod,
    route,
    token,
    responseArgs,
) => {
    // CaptchaMiddleware.mockImplementationOnce((req, res, next) => {
    //     if (!req.body.hcaptchaToken) {
    //         return next(ApiError.badRequest('Капча не пройдена'))
    //     }
    //     next()
    // })

    let request = requestMethod(route)

    if (token) {
        request.set('Authorization', `Bearer ${token}`)
    }

    if (responseArgs) {
        request.send(responseArgs)
    }

    const response = await request

    expect(response.status).toBe(400)
    expect(handler).not.toHaveBeenCalled()
    expect(response.body.message).toBe('Капча не пройдена')
}

module.exports = {
    checkRouteWithInvalidInfo,
    checkRouteWithInvalidToken,
    checkRouteWithNonexistentData,
    checkRouteWithoutAdminRights,
    checkRouteWithAnotherCandidate,
    checkRouteWithUnexpectedError,
    checkRouteWithEmptyCaptcha
}