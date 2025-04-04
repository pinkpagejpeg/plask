import { $authHost, $host } from "../http"
import { check, CustomJwtPayload, deleteAccount, deleteImage, getInfo, login, registration, updateImage, updateInfo } from "../userApi"
import { checkApi, checkApiError, checkApiWithJwt } from "./checkApi"

interface IUserMockData {
    user: {
        id: number,
        email: string,
        password: string,
        role: string,
        img: string,
        createdAt: string,
        updatedAt: string
    }
}

jest.mock('../http', () => ({
    $host: {
        post: jest.fn()
    },
    $authHost: {
        get: jest.fn(),
        patch: jest.fn(),
        post: jest.fn(),
        delete: jest.fn(),
    }
}))

describe('userApi tests', () => {
    let jwtDecodedMockData: CustomJwtPayload,
        userMockData: IUserMockData,
        updatedUserMockData: IUserMockData

    beforeAll(() => {
        jwtDecodedMockData = {
            id: 22,
            email: 'user@example.com',
            role: 'USER'
        }

        userMockData = {
            user: {
                id: 22,
                email: 'user@example.com',
                password: 'hashedPassword123',
                role: 'USER',
                img: 'user_default_image.jpg',
                createdAt: "2025-01-26 13:48:44.315+03",
                updatedAt: "2025-01-26 13:48:44.315+03",
            }
        }

        updatedUserMockData = {
            user: {
                ...userMockData.user, img: 'new_profile_image.jpg'
            }
        }
    })

    test('Registration', async () => {
        await checkApiWithJwt(
            $host.post as jest.Mock,
            registration,
            jwtDecodedMockData,
            ['api/user/registration', {
                email: 'user@example.com',
                password: '12345678',
                role: 'USER',
                hcaptchaToken: '123'
            }],
            ['user@example.com', '12345678', '123']
        )
    })

    test('Registration with error', async () => {
        await checkApiError(
            $host.post as jest.Mock,
            registration,
            ['api/user/registration', {
                email: 'user@example.com',
                password: '12345678',
                role: 'USER',
                hcaptchaToken: '123'
            }],
            ['user@example.com', '12345678', '123']
        )
    })

    test('Login', async () => {
        await checkApiWithJwt(
            $host.post as jest.Mock,
            login,
            jwtDecodedMockData,
            ['api/user/login', {
                email: 'user@example.com',
                password: '12345678',
                hcaptchaToken: '123'
            }],
            ['user@example.com', '12345678', '123']
        )
    })

    test('Login with error', async () => {
        await checkApiError(
            $host.post as jest.Mock,
            login,
            ['api/user/login', {
                email: 'user@example.com',
                password: '12345678',
                hcaptchaToken: '123'
            }],
            ['user@example.com', '12345678', '123']
        )
    })

    test('Check', async () => {
        await checkApiWithJwt(
            $authHost.get as jest.Mock,
            check,
            jwtDecodedMockData,
            ['api/user/auth']
        )
    })

    test('Check with error', async () => {
        await checkApiError(
            $authHost.get as jest.Mock,
            check,
            ['api/user/auth']
        )
    })

    test('Get user info', async () => {
        await checkApi(
            $authHost.get as jest.Mock,
            getInfo,
            userMockData,
            [`api/user/`],
        )
    })

    test('Get user info with error', async () => {
        await checkApiError(
            $authHost.get as jest.Mock,
            getInfo,
            [`api/user/`],
        )
    })

    test('Update user info', async () => {
        await checkApiWithJwt(
            $authHost.patch as jest.Mock,
            updateInfo,
            jwtDecodedMockData,
            ['api/user/info', {
                email: 'updateUser@example.com',
                password: '12345678',
            }],
            ['updateUser@example.com', '12345678']
        )

        await checkApiWithJwt(
            $authHost.patch as jest.Mock,
            updateInfo,
            jwtDecodedMockData,
            ['api/user/info', {
                email: 'updateUser@example.com',
                password: '1234567890',
            }],
            ['updateUser@example.com', '1234567890'],
            2
        )
    })

    test('Update user info with error', async () => {
        await checkApiError(
            $authHost.patch as jest.Mock,
            updateInfo,
            ['api/user/info', {
                email: 'updateUser@example.com',
                password: '12345678',
            }],
            ['updateUser@example.com', '12345678']
        )
    })

    test('Update user image', async () => {
        const formData = new FormData()
        formData.append('image', 'new_profile_image.jpg')

        await checkApi(
            $authHost.patch as jest.Mock,
            updateImage,
            updatedUserMockData,
            [`api/user/image`, formData],
            [formData]
        )
    })

    test('Update user image with error', async () => {
        const formData = new FormData()
        formData.append('image', 'new_profile_image.jpg')

        await checkApiError(
            $authHost.patch as jest.Mock,
            updateImage,
            [`api/user/image`, formData],
            [formData]
        )
    })

    test('Delete user image', async () => {
        await checkApi(
            $authHost.delete as jest.Mock,
            deleteImage,
            userMockData,
            [`api/user/image`],
        )
    })

    test('Delete user image with error', async () => {
        await checkApiError(
            $authHost.delete as jest.Mock,
            deleteImage,
            [`api/user/image`],
        )
    })

    test('Delete account', async () => {
        await checkApi(
            $authHost.delete as jest.Mock,
            deleteAccount,
            { deletedUserId: 24 },
            [`api/user/`],
        )
    })

    test('Delete account with error', async () => {
        await checkApiError(
            $authHost.delete as jest.Mock,
            deleteAccount,
            [`api/user/`],
        )
    })

    afterEach(() => jest.clearAllMocks())
})