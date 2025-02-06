import { $authHost, $host } from "../http"
import { check, createUser, CustomJwtPayload, deleteUser, deleteUserImage, getUser, getUsers, login, registration, updateUser, updateUserImage, updateUserInfo } from "../userApi"
import { checkApi, checkApiWithJwt } from "./checkApi"

interface IUserMockData {
    id: number,
    email: string,
    password: string,
    role: string,
    img: string,
    createdAt: string,
    updatedAt: string
}

jest.mock('../http', () => ({
    $host: {
        post: jest.fn()
    },
    $authHost: {
        get: jest.fn(),
        put: jest.fn(),
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
            id: 22,
            email: 'user@example.com',
            password: 'hashedPassword123',
            role: 'USER',
            img: 'user_default_image.jpg',
            createdAt: "2025-01-26 13:48:44.315+03",
            updatedAt: "2025-01-26 13:48:44.315+03",
        }

        updatedUserMockData = { ...userMockData, img: 'new_profile_image.jpg' }
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

    test('Check', async () => {
        await checkApiWithJwt(
            $authHost.get as jest.Mock,
            check,
            jwtDecodedMockData,
            ['api/user/auth']
        )
    })

    test('Get user info', async () => {
        await checkApi(
            $authHost.get as jest.Mock,
            getUser,
            userMockData,
            [`api/user/22`],
            [22]
        )
    })

    test('Update user info', async () => {
        await checkApiWithJwt(
            $authHost.put as jest.Mock,
            updateUserInfo,
            jwtDecodedMockData,
            ['api/user/info', {
                userId: 22,
                email: 'updateUser@example.com',
                password: '12345678',
            }],
            [22, 'updateUser@example.com', '12345678']
        )

        await checkApiWithJwt(
            $authHost.put as jest.Mock,
            updateUserInfo,
            jwtDecodedMockData,
            ['api/user/info', {
                userId: 22,
                email: 'updateUser@example.com',
                password: '1234567890',
            }],
            [22, 'updateUser@example.com', '1234567890'],
            2
        )
    })

    test('Update user image', async () => {
        const formData = new FormData()
        formData.append('image', 'new_profile_image.jpg')

        await checkApi(
            $authHost.put as jest.Mock,
            updateUserImage,
            updatedUserMockData,
            [`api/user/22/image`, formData],
            [22, formData]
        )
    })

    test('Delete user image', async () => {
        await checkApi(
            $authHost.put as jest.Mock,
            deleteUserImage,
            userMockData,
            [`api/user/image`, { userId: 22 }],
            [22]
        )
    })

    afterEach(() => jest.clearAllMocks())
})

describe('userApi admin tests', () => {
    let mockData: IUserMockData[],
        createdMockData: IUserMockData,
        updatedEmailMockData: IUserMockData,
        updatedPasswordMockData: IUserMockData,
        updatedRoleMockData: IUserMockData

    beforeAll(() => {
        mockData = [
            {
                id: 22,
                email: 'user@example.com',
                password: 'hashedPassword123',
                role: 'USER',
                img: 'user_default_image.jpg',
                createdAt: "2025-01-26 13:48:44.315+03",
                updatedAt: "2025-01-26 13:48:44.315+03",
            },
            {
                id: 23,
                email: 'admin@example.com',
                password: 'hashedAdminPassword123',
                role: 'ADMIN',
                img: 'user_default_image.jpg',
                createdAt: "2025-01-26 13:48:44.315+03",
                updatedAt: "2025-01-26 13:48:44.315+03",
            }
        ]

        createdMockData = {
            id: 24,
            email: 'newUser@example.com',
            password: 'hashedPassword123',
            role: 'USER',
            img: 'user_default_image.jpg',
            createdAt: "2025-01-26 13:48:44.315+03",
            updatedAt: "2025-01-26 13:48:44.315+03",
        }

        updatedEmailMockData = { ...createdMockData, email: 'updateUser@example.com' }
        updatedPasswordMockData = { ...updatedEmailMockData, password: 'updateHashedPassword123' }
        updatedRoleMockData = { ...updatedPasswordMockData, role: 'ADMIN' }
    })

    test('Get users', async () => {
        await checkApi(
            $authHost.get as jest.Mock,
            getUsers,
            mockData,
            ['api/user/']
        )
    })

    test('Create user', async () => {
        await checkApi(
            $authHost.post as jest.Mock,
            createUser,
            createdMockData,
            ['api/user/', {
                email: 'newUser@example.com',
                password: 'hashedPassword123',
                role: 'USER'
            }],
            ['newUser@example.com', 'hashedPassword123', 'USER']
        )
    })

    test('Update users', async () => {
        await checkApi(
            $authHost.put as jest.Mock,
            updateUser,
            updatedEmailMockData,
            [`api/user/`, {
                userId: 24,
                email: 'updateUser@example.com',
                password: 'hashedPassword123',
                role: 'USER'
            }],
            [24, 'updateUser@example.com', 'hashedPassword123', 'USER']
        )

        await checkApi(
            $authHost.put as jest.Mock,
            updateUser,
            updatedPasswordMockData,
            [`api/user/`, {
                userId: 24,
                email: 'updateUser@example.com',
                password: 'updateHashedPassword123',
                role: 'USER'
            }],
            [24, 'updateUser@example.com', 'updateHashedPassword123', 'USER'],
            2
        )

        await checkApi(
            $authHost.put as jest.Mock,
            updateUser,
            updatedRoleMockData,
            [`api/user/`, {
                userId: 24,
                email: 'updateUser@example.com',
                password: 'hashedPassword123',
                role: 'ADMIN'
            }],
            [24, 'updateUser@example.com', 'hashedPassword123', 'ADMIN'],
            3
        )
    })

    test('Delete users', async () => {
        await checkApi(
            $authHost.delete as jest.Mock,
            deleteUser,
            { deletedUserId: 24 },
            [`api/user/24`],
            [24]
        )
    })

    afterEach(() => jest.clearAllMocks())
})