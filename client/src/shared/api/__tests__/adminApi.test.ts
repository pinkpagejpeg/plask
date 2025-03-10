import { $authHost } from "../http"
import { createUser, deleteUser, getUsers, updateUser, getFeedbacks, updateFeedbackStatus } from "../adminApi"
import { checkApi } from "./checkApi"

interface IMockFeedbackData {
    data: {
        feedbacks: IMockFeedback[],
        count: number
    }
}

interface IMockFeedback {
    id: number,
    info: string,
    date: string,
    status: boolean,
    userId: number,
    createdAt: string,
    updatedAt: string,
}

interface IMockUserData {
    data: {
        users: IMockUser[],
        count: number
    }
}

interface IMockUser {
    id: number,
    email: string,
    password: string,
    role: string,
    img: string,
    createdAt: string,
    updatedAt: string
}

jest.mock('../http', () => ({
    $authHost: {
        get: jest.fn(),
        patch: jest.fn(),
        post: jest.fn(),
        delete: jest.fn(),
    }
}))

describe('adminApi user tests', () => {
    let mockData: IMockUserData,
        createdMockData: IMockUser,
        updatedEmailMockData: IMockUser,
        updatedPasswordMockData: IMockUser,
        updatedRoleMockData: IMockUser

    beforeAll(() => {
        mockData = {
            data: {
                users: [
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
                ],
                count: 2
            }
        }

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
            ['api/admin/users']
        )
    })

    test('Create user', async () => {
        await checkApi(
            $authHost.post as jest.Mock,
            createUser,
            createdMockData,
            ['api/admin/users', {
                email: 'newUser@example.com',
                password: 'hashedPassword123',
                role: 'USER'
            }],
            ['newUser@example.com', 'hashedPassword123', 'USER']
        )
    })

    test('Update user', async () => {
        await checkApi(
            $authHost.patch as jest.Mock,
            updateUser,
            updatedEmailMockData,
            [`api/admin/users/24`, {
                email: 'updateUser@example.com',
                password: 'hashedPassword123',
                role: 'USER'
            }],
            [24, 'updateUser@example.com', 'hashedPassword123', 'USER']
        )

        await checkApi(
            $authHost.patch as jest.Mock,
            updateUser,
            updatedPasswordMockData,
            [`api/admin/users/24`, {
                email: 'updateUser@example.com',
                password: 'updateHashedPassword123',
                role: 'USER'
            }],
            [24, 'updateUser@example.com', 'updateHashedPassword123', 'USER'],
            2
        )

        await checkApi(
            $authHost.patch as jest.Mock,
            updateUser,
            updatedRoleMockData,
            [`api/admin/users/24`, {
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
            [`api/admin/users/24`],
            [24]
        )
    })

    afterEach(() => jest.clearAllMocks())
})

describe('adminApi feedback tests', () => {
    let mockData: IMockFeedbackData, updatedMockData: IMockFeedback

    beforeAll(() => {
        mockData = {
            data: {
                feedbacks: [
                    {
                        id: 2,
                        info: "Great project, looking forward to the next version!",
                        date: "2025-01-26",
                        status: true,
                        userId: 18,
                        createdAt: "2025-01-26 13:48:44.241+03",
                        updatedAt: "2025-01-26 13:48:44.241+03",
                    },
                    {
                        id: 3,
                        info: "The documentation is a bit lacking, could use more detail.",
                        date: "2025-01-26",
                        status: false,
                        userId: 18,
                        createdAt: "2025-01-26 13:48:44.241+03",
                        updatedAt: "2025-01-26 13:48:44.241+03",
                    }
                ],
                count: 2
            }
        }

        updatedMockData = { ...mockData.data.feedbacks[1], status: true }
    })

    test('Update feedback api', async () => {
        await checkApi(
            $authHost.patch as jest.Mock,
            updateFeedbackStatus,
            updatedMockData,
            [`api/admin/feedbacks/3`, { status: true }],
            [3, true],
        )
    })

    test('Get feedback api', async () => {
        await checkApi(
            $authHost.get as jest.Mock,
            getFeedbacks,
            mockData,
            [`api/admin/feedbacks`],
        )
    })

    afterEach(() => jest.clearAllMocks())
})